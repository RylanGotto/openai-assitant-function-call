get_news = {
  "name": "news",
  "description": "Get news from NewsAPI",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The user query to get news articles about"
      }
    },
    "required": [
      "query"
    ]
  }
}

search = {
  "name": "google",
  "description": "Gets search results from google",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The user query to get infomation from google about"
      }
    },
    "required": [
      "query"
    ]
  }
}

wikipedia = {
  "name": "wikipeida",
  "description": "Gets search results from wikipedia",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The user query to get infomation from wikipedia about"
      }
    },
    "required": [
      "query"
    ]
  }
}

fetch = {
  "name": "fetch",
  "description": "Get the content from a url",
  "parameters": {
    "type": "object",
    "properties": {
      "url": {
        "type": "string",
        "description": "If the user requests the content of a url or article this function will retrieve the html document"
      }
    },
    "required": [
      "url"
    ]
  }
}