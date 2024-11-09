import json

from typing_extensions import override

from openai import AssistantEventHandler


class EventHandler(AssistantEventHandler):
    def __init__(self, assistant):
        super().__init__()
        self.Assistant = assistant

    @override
    def on_text_created(self, text) -> None:
        print(f"\nassistant > ", end="", flush=True)

    @override
    def on_text_delta(self, delta, snapshot):
        print(delta.value, end="", flush=True)

    @override
    def on_run_step_created(self, run_step) -> None:
        self.Assistant.run_id = run_step.run_id

    def on_tool_call_done(self, tool_call) -> None:
        self.Assistant.tool_call_id = tool_call.id
        name = tool_call.function.name
        query = json.loads(tool_call.function.arguments)

        q = query["query"]
        search_response = {}
        match name:
            case "news":
                search_response = self.Assistant.search.search_news(q)
            case "google":
                search_response = self.Assistant.search.search_google(q)
            case "wikipeida":
                search_response = self.Assistant.search.search_wikipedia(q)
            case "fetch":
                search_response = self.Assistant.search.fetch_url(q)
            case _:
                pass

        self.Assistant.submit_tool_outputs_stream(search_response)
