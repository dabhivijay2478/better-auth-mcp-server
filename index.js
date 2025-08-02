import fs from "fs/promises";
import fetch from "node-fetch";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const SERVER_NAME = "better-auth-llms";
const SERVER_VERSION = "1.0.0";
const LOCAL_FILE_PATH = "better-auth.txt";

async function initResources(server) {
  server.registerResource(
    "llms_index",
    `file://${LOCAL_FILE_PATH}`,
    {
      title: "Better Auth llms.txt",
      description: "Documentation index from better-auth",
      mimeType: "text/plain"
    },
    async () => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        return { contents: [{ uri: `file://${LOCAL_FILE_PATH}`, text }] };
      } catch (error) {
        console.error(`Failed fetching ${LOCAL_FILE_PATH}:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );
}

async function initTools(server) {
  server.registerTool(
    "fetch_list",
    {
      uri: "tool://better-auth/fetch_list",
      title: "Get llms.txt URLs",
      description: "Returns an array of URLs listed in llms.txt",
      inputSchema: undefined,
      outputSchema: { urls: { type: "array", items: { type: "string" } } }
    },
    async () => {
      try {
        const text = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
        const urls = text.split("\n").filter(l => l.trim().startsWith("http"));
        return { urls };
      } catch (error) {
        console.error(`Failed reading ${LOCAL_FILE_PATH} for fetch_list:`, error);
        throw new Error(`Failed to read file: ${LOCAL_FILE_PATH}`);
      }
    }
  );

  server.registerTool(
    "fetch_page",
    {
      uri: "tool://better-auth/fetch_page",
      title: "Fetch individual page",
      description: "Fetch content from allowed better-auth.com URL",
      inputSchema: { url: { type: "string" } },
      outputSchema: { url: { type: "string" }, content: { type: "string" } }
    },
    async ({ url }) => {
      if (!url.startsWith("https://raw.githubusercontent.com/better-auth/better-auth/")) {
        console.warn("Attempt blocked URL:", url);
        throw new Error("Domain not allowed");
      }
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const content = await resp.text();
      return { url, content };
    }
  );
}

async function main() {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
    capabilities: { resources: {}, tools: {} }
  });

  await initResources(server);
  await initTools(server);

  // Use console.error for logging to avoid interfering with MCP communication on stdout
  console.error("MCP Server ready:", SERVER_NAME, SERVER_VERSION);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error("Fatal MCP error:", err);
  process.exit(1);
});