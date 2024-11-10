import json
import os

from dotenv import load_dotenv
from openai import OpenAI
from tornado import ioloop, web, websocket

from oaia.assistant import Assistant
from oaia.search import Search

cl = []
load_dotenv()


class IndexHandler(web.RequestHandler):
    def get(self):
        self.render("index.html")


class SocketHandler(websocket.WebSocketHandler):
    assistant = None

    def factory(self, websocket):
        client = OpenAI(
            organization=os.environ.get("OPENAI_ORG"),
            project=os.environ.get("OPENAI_PROJECT"),
        )
        search = Search()
        assitant = Assistant(client, search, websocket)
        assistant_id = assitant.list_assistants().data[0].id
        assitant.set_active_assitant(assistant_id).create_new_thread()
        return assitant

    def check_origin(self, origin):
        return True

    def open(self):
        self.assistant = self.factory(self)

    def on_message(self, message):
        self.assistant.create_new_message(message)
        self.assistant.create_and_stream()


app = web.Application(
    [
        (r"/ws", SocketHandler),
    ]
)

if __name__ == "__main__":
    app.listen(8000)
    ioloop.IOLoop.instance().start()
