import React from "react";
import "./chat.scss";
import HeaderChat from "./headerChat/HeaderChat";
import Messages from "./messages/Messages";
import Input from "./input/Input";
import ChatSidebar from "./chatSidebar/ChatSidebar";
import { useChat } from "../../contexts/ChatContext";

export default function Chat() {
  const { data } = useChat();

  return (
    <div className="chat col pc-10 t-9 m-12">
      <div className="chat-container pc-9 m-12 t-12">
        {data.user.uid && (
          <>
            <HeaderChat />
            <Messages />
            <Input />
          </>
        )}
      </div>
      <div className="pc-3 m-0 t-0">
        <ChatSidebar />
      </div>
    </div>
  );
}
