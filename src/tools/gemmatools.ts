export const tools = [
  {
    type: "function",
    function: {
      name: "generate_image",
      description:
        "Call this tool whenever the user wants to create, generate, draw, or visualize an image, picture, artwork, or any other visual content. Requests may be in either English or Bengali.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description:
              "A short, strong, and effective English prompt for image generation. Keep it concise while maximizing visual quality and clarity.",
          },
        },
        required: ["prompt"],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for real-time information like news, weather, sports scores, stock prices, or any current events',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to look up',
          },
        },
        required: ['query'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather information for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name, e.g. Dhaka, Rajshahi',
          },
        },
        required: ['location'],
      },
    },
  },
];