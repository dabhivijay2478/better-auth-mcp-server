import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
const SERVER_NAME = "better-v-auth";
const SERVER_VERSION = "1.0.2";
const LLM_DIR = "/Users/vijay.d/Vijay Workspace/auth/LLM";
let LLM_DOCS_CACHE = null;
function normalizeTopic(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function splitIntoParasWithLineRanges(text) {
    const lines = text.split(/\r?\n/);
    const paragraphs = [];
    let buffer = [];
    let paraStart = 1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === "") {
            if (buffer.length > 0) {
                paragraphs.push({ startLine: paraStart, endLine: i, paragraph: buffer.join("\n") });
                buffer = [];
            }
            paraStart = i + 2;
        }
        else {
            if (buffer.length === 0)
                paraStart = i + 1;
            buffer.push(line);
        }
    }
    if (buffer.length > 0)
        paragraphs.push({ startLine: paraStart, endLine: lines.length, paragraph: buffer.join("\n") });
    return paragraphs;
}
function loadLLMDataset() {
    if (LLM_DOCS_CACHE)
        return LLM_DOCS_CACHE;
    if (!fs.existsSync(LLM_DIR))
        return (LLM_DOCS_CACHE = []);
    const entries = fs.readdirSync(LLM_DIR, { withFileTypes: true });
    const files = entries.filter((e) => e.isFile() && (e.name.endsWith(".md") || e.name.endsWith(".txt")));
    LLM_DOCS_CACHE = files.map((f) => {
        const filePath = path.join(LLM_DIR, f.name);
        const content = fs.readFileSync(filePath, "utf8");
        return { filePath, fileName: f.name, content, lines: content.split(/\r?\n/) };
    });
    return LLM_DOCS_CACHE;
}
function pickCandidateFiles(allDocs, topic) {
    if (!topic || topic.trim() === "")
        return allDocs;
    const t = normalizeTopic(topic);
    const alias = new Map([
        ["concepts", ["concept", "core concepts", "concpets", "overview"]],
        ["authentication", ["auth", "signin", "login", "methods"]],
        ["plugins", ["plugin", "extensions", "otp", "magic link", "2fa", "passkey"]],
        ["integration", ["integrations", "framework", "next", "nuxt", "express", "svelte", "remix"]],
        ["database", ["db", "adapter", "schema", "migration", "drizzle", "prisma", "postgres", "sqlite", "mongodb"]],
        ["reference", ["api", "options", "reference"]],
    ]);
    function scoreName(name) {
        const n = normalizeTopic(name);
        let score = 0;
        if (n.includes(t))
            score += 3;
        for (const [canon, synonyms] of alias.entries()) {
            if (t.includes(canon) || synonyms.some((s) => t.includes(s))) {
                if (n.includes(canon) || synonyms.some((s) => n.includes(s)))
                    score += 2;
            }
        }
        return score;
    }
    const scored = allDocs.map((d) => ({ d, s: scoreName(d.fileName) }));
    const max = Math.max(0, ...scored.map((x) => x.s));
    if (max === 0)
        return allDocs;
    const kept = scored.filter((x) => x.s >= Math.max(1, max - 1)).map((x) => x.d);
    return kept.length > 0 ? kept : allDocs;
}
function scoreParagraph(paragraph, query) {
    const q = normalizeTopic(query);
    const terms = q.split(" ").filter(Boolean);
    if (terms.length === 0)
        return 0;
    const p = normalizeTopic(paragraph);
    let score = 0;
    for (const term of terms) {
        if (term.length < 3)
            continue;
        const occurrences = p.split(term).length - 1;
        score += occurrences;
    }
    if (p.includes(q) && q.length > 10)
        score += 2;
    const len = Math.max(40, paragraph.length);
    score = score * (200 / len);
    return score;
}
function retrieve(topic, question) {
    const all = loadLLMDataset();
    const candidates = pickCandidateFiles(all, topic);
    const ranked = [];
    for (const doc of candidates) {
        const paras = splitIntoParasWithLineRanges(doc.content);
        for (const para of paras) {
            const s = scoreParagraph(para.paragraph, question);
            if (s > 0.05)
                ranked.push({ file: doc, startLine: para.startLine, endLine: para.endLine, text: para.paragraph, score: s });
        }
    }
    ranked.sort((a, b) => b.score - a.score);
    const top = ranked.slice(0, 4);
    if (top.length === 0) {
        const anyDoc = all[0];
        const answer = "No direct match found. Check the documentation topics in the LLM folder for guidance.";
        return {
            answer,
            snippets: anyDoc ? [{ file: anyDoc.fileName, startLine: 1, endLine: Math.min(20, anyDoc.lines.length), text: anyDoc.lines.slice(0, 20).join("\n") }] : [],
            sources: anyDoc ? [{ file: anyDoc.fileName, lines: `1-${Math.min(20, anyDoc.lines.length)}` }] : [],
            confidence: 0.1,
        };
    }
    const pieces = top.map((s) => s.text.trim());
    const combined = pieces.join("\n\n");
    const answer = combined.length > 1600 ? combined.slice(0, 1575) + "…" : combined;
    return {
        answer,
        snippets: top.map((s) => ({ file: s.file.fileName, startLine: s.startLine, endLine: s.endLine, text: s.text })),
        sources: top.map((s) => ({ file: s.file.fileName, lines: `${s.startLine}-${s.endLine}` })),
        confidence: Math.min(0.95, 0.4 + top.reduce((acc, s) => acc + s.score, 0) / 20),
    };
}
async function initTools(server) {
    server.registerTool("ask_better_auth", {
        title: "Ask Better Auth Docs",
        description: "Answer a Better Auth question using local docs in the LLM folder. Provide a topic and a question.",
        inputSchema: {
            topic: z.string().describe("High-level area, e.g. 'authentication', 'plugins', 'database', 'integration', 'concepts'."),
            question: z.string().describe("Your specific question."),
        },
    }, async ({ topic, question }) => {
        if (!question || question.trim().length === 0)
            throw new Error("'question' is required");
        const { answer, snippets, sources, confidence } = retrieve(topic, question);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ topic, question, answer, confidence, citations: sources, snippets }, null, 2),
                },
            ],
        };
    });
}
async function main() {
    const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });
    await initTools(server);
    console.error("🚀 Better Auth MCP Server ready:", SERVER_NAME, SERVER_VERSION);
    console.error("📚 LLM-based doc retrieval tool loaded (ask_better_auth)");
    console.error("🔧 Available tools:", 1);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("💥 Fatal MCP error:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map