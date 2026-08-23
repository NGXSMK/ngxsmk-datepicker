export interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
export declare const TOOLS_METADATA: ToolDefinition[];
/**
 * Executes a tool by name with arguments.
 */
export declare function executeTool(name: string, args: Record<string, unknown>): unknown;
/**
 * Formats tools for OpenAI function calling (GPT-4o, Assistants API, ChatGPT Connectors).
 */
export declare function formatOpenAiTools(): {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
}[];
/**
 * Formats tools for Google Gemini Function Declarations (Gemini 1.5/2.0, Vertex AI).
 */
export declare function formatGeminiTools(): {
    functionDeclarations: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    }[];
};
/**
 * Formats tools for Anthropic Claude Tools (Claude 3.5 Sonnet, Claude Desktop).
 */
export declare function formatClaudeTools(): {
    name: string;
    description: string;
    input_schema: Record<string, unknown>;
}[];
