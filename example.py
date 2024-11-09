import os

from dotenv import load_dotenv

from assistant import Assistant
from openai import OpenAI
from search import Search

PROGRESS = "in_progress"
COMPLETED = "completed"
ACTION = "requires_action"
QUEUED = "queued"


def main():
    client = OpenAI(
        organization=os.environ.get("OPENAI_ORG"),
        project=os.environ.get("OPENAI_PROJECT"),
    )
    search = Search()
    assitant = Assistant(client, search)
    assistant_id = assitant.list_assistants().data[0].id
    assitant.set_active_assitant(assistant_id).create_new_thread()

    """
        TODO: Replace while with event loop.
    """
    while 1:
        user_input = input("\nTalk to your assistant: ")

        assitant.create_new_message(user_input)
        assitant.create_and_stream()

        # The below runs without streaming.

        # run_status = assitant.get_run_status()
        # while run_status in [PROGRESS, QUEUED]:
        #     run_status = assitant.get_run_status()

        # if run_status == COMPLETED:
        #     print(assitant.get_response_message())

        # if run_status == ACTION:
        #     funcation_call = assitant.get_function_call_from_run()
        #     search_response = {}
        #     match funcation_call['name']:
        #         case 'news':
        #             search_response = search.search_news(funcation_call['query'])
        #         case 'google':
        #             search_response = search.search_google(funcation_call['query'])
        #         case 'wikipeida':
        #             search_response = search.search_wikipedia(funcation_call['query'])
        #         case 'fetch':
        #             search_response = search.fetch_url(funcation_call['query'])
        #         case _:
        #             pass

        #     assitant.submit_tool_outputs(search_response)

        #     run_status = assitant.get_run_status()
        #     while run_status in [PROGRESS, QUEUED]:
        #         print(run_status)
        #         run_status = assitant.get_run_status()

        #     if run_status == COMPLETED:
        #         print(assitant.get_response_message())


if __name__ == "__main__":
    load_dotenv()
    main()
