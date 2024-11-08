import json

class Assistant():
    def __init__(self, client):
        self.client = client
        self.assistant_id = None
        self.thread_id = None
        self.run_id = None
        self.assistants = None
        self.run = None
        self.tool_call_id = None

    def list_assistants(self):
        self.assistants = self.client.beta.assistants.list(
            order="desc",
            limit="20",
        )
        return self.assistants
    
    def set_active_assitant(self, assistant_id):
        self.assistant_id = assistant_id
        return self
    
    def create_new_thread(self):
        self.thread_id = self.client.beta.threads.create().id
        return self
    
    def set_thread_id(self, thread_id):
        self.thread_id = thread_id

    def create_new_run(self):
        self.run_id = self.client.beta.threads.runs.create(
            thread_id=self.thread_id,
            assistant_id=self.assistant_id
        ).id
        return self

    def retrieve_run(self):
        self.run = self.client.beta.threads.runs.retrieve(
            thread_id=self.thread_id,
            run_id=self.run_id
        )
        return self
    
    def get_run_status(self):
        return self.client.beta.threads.runs.retrieve(
            thread_id=self.thread_id,
            run_id=self.run_id
        ).status
    
    def get_function_call_from_run(self):
        '''
            This would be unique to the schema that is defined.
        '''
        self.retrieve_run()
        self.tool_call_id = self.run.required_action.submit_tool_outputs.tool_calls[0].id
        return {
            'query': json.loads(self.run.required_action.submit_tool_outputs.tool_calls[0].function.arguments)['query'],
            'name': self.run.required_action.submit_tool_outputs.tool_calls[0].function.name,
            'tool_call_id': self.run.required_action.submit_tool_outputs.tool_calls[0].id
        }
    
    def create_new_message(self, prompt):
        self.client.beta.threads.messages.create(
            self.thread_id,
            role="user",
            content=prompt,
        )
        return self
    
    def get_response_message(self):
        all_messages = self.client.beta.threads.messages.list(
                thread_id=self.thread_id
        )
        return all_messages.data[0].content[0].text.value
    
    def submit_tool_outputs(self, data):
        self.client.beta.threads.runs.submit_tool_outputs(
            thread_id=self.thread_id,
            run_id=self.run_id,
            tool_outputs=[
                {
                    "tool_call_id": self.tool_call_id,
                    "output": json.dumps(data)
                }
            ]
        )
