import fetch from "node-fetch";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const SERVER_NAME = "better-auth-llms";
const SERVER_VERSION = "1.0.0";
const BASE_URL = "https://www.better-auth.com/llms.txt";

async function initResources(server) {
  server.registerResource(
    "llms_index",
    "llms://better-auth/llms.txt",
    {
      title: "Better Auth llms.txt",
      description: "Documentation index from better-auth",
      mimeType: "text/plain"
    },
    async () => {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        console.error("Failed fetching llms.txt:", res.status);
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      return { contents: [{ uri: BASE_URL, text }] };
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
      const resp = await fetch(BASE_URL);
      const text = await resp.text();
      const urls = text.split("\n").filter(l => l.trim().startsWith("http"));
      return { urls };
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
      if (!url.startsWith("https://www.better-auth.com/")) {
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

  console.log("MCP Server ready:", SERVER_NAME, SERVER_VERSION);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error("Fatal MCP error:", err);
  process.exit(1);
});
