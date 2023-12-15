import OpenAI from "openai";
import { useEffect, useState } from "react";

function App() {
  const [selectedChat, setSelectedChat] = useState({
    id: "",
    messeges: [],
  });

  const [question, setQuestion] = useState("");
  const [myAssistants, setMyAssistants] = useState([]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const openai = new OpenAI({
    apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await openai.beta.assistants.list({
        order: "desc",
        limit: "100",
      });
      return response;
    }
    fetchData().then((res) => {
      setMyAssistants(res.data);
    });
  }, []);

  const createChat = async (e) => {
    e.preventDefault();
    setSelectedChat({
      ...selectedChat,
      messeges: [
        ...selectedChat.messeges,
        {
          user: question,
          chatbot: "",
          loading: true,
        },
      ],
    });
    setQuestion("");
    const thread = await openai.beta.threads.create();

    // Pass in the user question into the existing thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question,
    });

    // Use runs to wait for the assistant response and then retrieve it
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: selectedChat?.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Polling mechanism to see if runStatus is completed
    // This should be made more robust.
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed") {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (runStatus.status === "failed") {
      //   console.log(runStatus);
      const updateSelectedChat = {
        ...selectedChat,
        messeges: [
          ...selectedChat.messeges,
          {
            user: question,
            chatbot: runStatus?.last_error?.code,
            loading: false,
          },
        ],
      };
      setSelectedChat(updateSelectedChat);
    }

    // Get the last assistant message from the messages array
    const messages = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant"
      )
      .pop();
    const updateSelectedChat = {
      ...selectedChat,
      messeges: [
        ...selectedChat.messeges,
        {
          user: question,
          chatbot: lastMessageForRun?.content[0]?.text?.value,
          loading: false,
        },
      ],
    };
    setSelectedChat(updateSelectedChat);
  };

  return (
    <>
      {/* {isLoading && (
        <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
          <div className="flex justify-center items-center mt-[50vh]">
            <svg
              fill="none"
              className="w-20 h-20 animate-spin"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )} */}
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-col md:flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-full md:w-64 bg-white flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="font-bold text-xl border-2 px-7 py-1 rounded">
                All Assistants
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Assistants</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {myAssistants?.length}
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
                {myAssistants?.map((res, i) => (
                  <button
                    key={i}
                    className={`flex flex-row items-center ${
                      res?.id == selectedChat.id ? "bg-gray-50" : ""
                    } hover:bg-gray-100 rounded-xl p-2`}
                    onClick={() => {
                      setSelectedChat({
                        id: res?.id,
                        messeges: [],
                      });
                    }}
                  >
                    <div className="text-sm font-semibold">{res?.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {selectedChat?.messeges?.map((res, i) => {
                      return (
                        <>
                          {res?.user !== undefined && (
                            <div
                              key={i}
                              className="col-start-6 col-end-13 p-3 rounded-lg"
                            >
                              <div className="flex items-center justify-start flex-row-reverse">
                                <div className="flex items-center text-white justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                  Me
                                </div>
                                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                  <div>{res?.user}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {res?.chatbot !== undefined && (
                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                              <div className="flex flex-row items-center">
                                <div className="flex items-center text-white justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                  Bot
                                </div>
                                {res?.loading ? (
                                  <div>
                                    <span className="loader"></span>
                                  </div>
                                ) : (
                                  <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>
                                      {res?.chatbot.replace(
                                        /&#8203;``【oaicite:1】``&#8203;/g,
                                        ""
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              {
                <form onSubmit={createChat}>
                  <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                    <div className="flex-grow">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={question}
                          disabled={selectedChat?.id === ""}
                          onChange={handleQuestionChange}
                          className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        type="submit"
                        className={`flex items-center justify-center  rounded-xl text-white px-4 py-1 flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 ${
                          selectedChat?.id === "" ? "opacity-50" : "opacity-100"
                        }`}
                        disabled={selectedChat?.id === ""}
                      >
                        <span>Send</span>
                        <span className="ml-2">
                          <svg
                            className="w-4 h-4 transform rotate-45 -mt-px"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
