import { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

export default function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function init() {
      if (!editorRef.current) {
        editorRef.current = Codemirror.fromTextArea(
          document.getElementById("realtimeEditor"),
          {
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
          }
        );

        editorRef.current.on("change", (instance, changes) => {
          const { origin } = changes;
          const code = instance.getValue();
          onCodeChange(code);
          if (origin !== "setValue" && socketRef.current) {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
              roomId,
              code,
            });
          }
        });
      }
    }
    init();

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, [onCodeChange, roomId, socketRef]);

  useEffect(() => {
    const socket = socketRef.current; 

    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorRef.current) {
          if (editorRef.current.getValue() !== code) {
            editorRef.current.setValue(code);
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    const modeMap = {
      javascript: "javascript",
      python: "python",
      java: "text/x-java",
      c: "text/x-csrc",
      cpp: "text/x-c++src",
    };
    if (editorRef.current) {
      editorRef.current.setOption("mode", modeMap[lang]);
    }
  };

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    setIsLoading(true);
    setIsError(false);
    setOutput([]);

    try {
      const response = await fetch(
        "https://collaboration-compiler-1.onrender.com/compile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: sourceCode,
            language: language,
          }),
        }
      );

      const data = await response.json();
      if (data.output) {
        setOutput(data.output.split("\n"));
        setIsError(false);
      } else if (data.error) {
        setIsError(true);
        setOutput([data.error]);
      } else {
        setOutput(["Execution complete (No Output)"]);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setOutput(["Failed to connect to server.", error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#282a36]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm font-bold">LANGUAGE:</span>
          <select
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <button
          onClick={runCode}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-1.5 rounded font-bold text-white transition-all
            ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 shadow-lg"
            }`}
        >
          {isLoading ? "Running..." : "▶ Run Code"}
        </button>
      </div>

      <div className="flex-grow overflow-hidden">
        <textarea id="realtimeEditor"></textarea>
      </div>

      <div className="h-48 bg-[#1e1e1e] border-t border-gray-700 flex flex-col">
        <div className="px-4 py-1 bg-[#252526] text-gray-400 text-xs font-bold uppercase border-b border-gray-700 flex justify-between">
          <span>Terminal Output</span>
          {isError && <span className="text-red-400">Error Detected</span>}
        </div>
        <div className="p-4 overflow-auto font-mono text-sm h-full">
          {output && output.length > 0 ? (
            output.map((line, i) => (
              <div
                key={i}
                className={`${isError ? "text-red-400" : "text-gray-300"}`}
              >
                {line}
              </div>
            ))
          ) : (
            <div className="text-gray-600 italic">
              Click "Run Code" to see output here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}