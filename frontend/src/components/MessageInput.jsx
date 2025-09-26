import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, Smile } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview("");
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addEmoji = (emoji) => {
    setText(prevText => prevText + emoji);
    setShowEmojiPicker(false);
    if (isSoundEnabled) playRandomKeyStrokeSound();
  };

  const commonEmojis = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '🙏', '😊', '🤔', '😎'];

  return (
    <div ref={containerRef} className="py-2 px-4 bg-gradient-to-br from-white via-indigo-100 to-pink-100 border-t border-purple-200 relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-white border border-purple-200 rounded-lg p-3 shadow-xl">
            <div className="grid grid-cols-5 gap-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl p-2 rounded-lg hover:bg-purple-100 transition-colors duration-200 hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-lg rotate-45 opacity-25 animate-bounce"></div>

      <div className="relative z-10">
        {/* Image Preview */}
        {imagePreview && (
          <div className="max-w-3xl mx-auto mb-3 flex items-center">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-purple-200 shadow-sm"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                type="button"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-3">
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`rounded-lg px-4 flex items-center justify-center border border-purple-200 bg-gradient-to-r from-white to-indigo-50 text-gray-600 hover:shadow-md transition-all duration-300 ${
              showEmojiPicker ? "text-purple-600 bg-purple-100" : ""
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            className="flex-1 border border-purple-200 rounded-lg py-2 px-4 bg-gradient-to-r from-white to-indigo-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all duration-300"
            placeholder="Type your message..."
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-lg px-4 flex items-center justify-center border border-purple-200 bg-gradient-to-r from-white to-indigo-50 text-gray-600 hover:shadow-md transition-all duration-300 ${
              imagePreview ? "text-purple-600" : ""
            }`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg px-4 py-2 font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageInput;
