import { useRef, useState } from "react";

function App() {
  const [usedFiles, setUsedFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(
    chatHistory?.length > 0 && chatHistory[0]
  );

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setUsedFiles([...usedFiles, selectedFile]);
  };

  const handleCreateNewChat = () => {
    if (usedFiles?.length > 0) {
      setChatHistory([
        ...chatHistory,
        {
          id: chatHistory?.length + 1,
          messeges: [],
        },
      ]);
      setSelectedChat({
        id: chatHistory?.length + 1,
        messeges: [],
      });
    } else {
      alert("Please Select a file");
    }
  };
  const [messege, setMessege] = useState("");
  const onhandleSendMessege = (e) => {
    e.preventDefault();
    const updateSelectedChat = {
      ...selectedChat,
      messeges: [
        ...selectedChat.messeges,
        {
          user: messege,
          chatbot: "",
        },
      ],
    };
    setSelectedChat(updateSelectedChat);

    const updatedChatHistory = chatHistory.map((chat) => {
      if (chat.id === selectedChat.id) {
        return updateSelectedChat;
      } else {
        return chat;
      }
    });
    setChatHistory(updatedChatHistory);
    setMessege("");
  };

  console.log(chatHistory);

  return (
    <>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-gray-100 flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <div className="ml-2 font-bold text-2xl">My Manuals</div>
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div
              onClick={handleButtonClick}
              className="flex border-b-2 border-black pb-3 mt-10 cursor-pointer"
            >
              <div>
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12V1m0 0L4 5m4-4 4 4m3 5v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                  />
                </svg>
              </div>
              <div className="text-xl font-bold text-center ml-2">
                New Upload
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Files</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {usedFiles?.length}
                </span>
              </div>
              <div className="mt-3 h-full overflow-y-auto over">
                {usedFiles?.map((res, i) => (
                  <div key={i} className="flex items-center mt-2">
                    {res?.type?.includes("pdf") ? (
                      <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 18a.969.969 0 0 0 .933 1h12.134A.97.97 0 0 0 15 18M1 7V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v5M6 1v4a1 1 0 0 1-1 1H1m0 9v-5h1.5a1.5 1.5 0 1 1 0 3H1m12 2v-5h2m-2 3h2m-8-3v5h1.375A1.626 1.626 0 0 0 10 13.375v-1.75A1.626 1.626 0 0 0 8.375 10H7Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.828 10h6.239m-6.239 4h6.239M6 1v4a1 1 0 0 1-1 1H1m14-4v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z"
                        />
                      </svg>
                    )}
                    <span className="ml-2">{res?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div
                onClick={handleCreateNewChat}
                className="font-bold text-xl border-2 px-7 py-1 rounded cursor-pointer"
              >
                Start New Chat
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">History</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {chatHistory?.length}
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
                {chatHistory?.map((res, i) => (
                  <>
                    {res?.messeges?.length > 0 ? (
                      <button
                        key={i}
                        className={`flex flex-row items-center ${
                          res?.id == selectedChat.id ? "bg-gray-50" : ""
                        } hover:bg-gray-100 rounded-xl p-2`}
                        onClick={() => setSelectedChat(res)}
                      >
                        <div className="text-sm font-semibold">
                          {res?.messeges[0]?.user == undefined
                            ? "New Messege"
                            : res?.messeges[0]?.user}
                        </div>
                      </button>
                    ) : (
                      <button
                        key={i}
                        className={`flex flex-row items-center ${
                          res?.id == selectedChat.id ? "bg-gray-50" : ""
                        } hover:bg-gray-100 rounded-xl p-2`}
                        onClick={() => setSelectedChat(res)}
                      >
                        <div className="text-sm font-semibold">New Messege</div>
                      </button>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {selectedChat?.messeges?.map((res, i) => (
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
                              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                <div>{res?.chatbot}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <form onSubmit={onhandleSendMessege}>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div className="flex-grow">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={messege}
                        onChange={(e) => setMessege(e.target.value)}
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
