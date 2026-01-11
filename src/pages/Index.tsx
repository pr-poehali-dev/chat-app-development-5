import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
  reactions?: string[];
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  viewed: boolean;
}

const chats: Chat[] = [
  { id: 1, name: 'Анна Петрова', avatar: '👩', lastMessage: 'Окей, встречаемся завтра!', time: '14:23', unread: 2, online: true },
  { id: 2, name: 'Команда Проекта', avatar: '👥', lastMessage: 'Михаил: Отлично, утверждаем', time: '13:45', unread: 5, online: false },
  { id: 3, name: 'Максим Иванов', avatar: '👨', lastMessage: 'Посмотри эту статью', time: '12:10', unread: 0, online: true },
  { id: 4, name: 'Мама ❤️', avatar: '👩‍🦰', lastMessage: 'Как дела?', time: 'Вчера', unread: 0, online: false },
  { id: 5, name: 'Фитнес Клуб', avatar: '💪', lastMessage: 'Напоминание о тренировке', time: 'Вчера', unread: 1, online: false },
];

const stories: Story[] = [
  { id: 1, name: 'Твоя история', avatar: '➕', viewed: false },
  { id: 2, name: 'Анна', avatar: '👩', viewed: false },
  { id: 3, name: 'Максим', avatar: '👨', viewed: true },
  { id: 4, name: 'Катя', avatar: '👱‍♀️', viewed: false },
  { id: 5, name: 'Олег', avatar: '🧑', viewed: true },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела?', time: '14:20', isOwn: false },
  { id: 2, text: 'Отлично! Спасибо 😊', time: '14:21', isOwn: true },
  { id: 3, text: 'Завтра встречаемся в 15:00?', time: '14:22', isOwn: false },
  { id: 4, text: 'Окей, встречаемся завтра!', time: '14:23', isOwn: true, reactions: ['❤️', '👍'] },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'stories' | 'settings'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageText, setMessageText] = useState('');
  const [showReactions, setShowReactions] = useState<number | null>(null);

  const reactions = ['❤️', '😂', '😮', '😢', '👍', '🔥'];

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.reactions || [];
        return {
          ...msg,
          reactions: currentReactions.includes(emoji) 
            ? currentReactions.filter(r => r !== emoji)
            : [...currentReactions, emoji]
        };
      }
      return msg;
    }));
    setShowReactions(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {selectedChat ? (
        <div className="flex flex-col h-full animate-fade-in">
          <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedChat(null)}
                className="hover:bg-purple-100"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback>{selectedChat.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                <p className="text-xs text-purple-600">{selectedChat.online ? '🟢 онлайн' : 'был(а) недавно'}</p>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                <Icon name="Phone" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                <Icon name="Video" size={20} />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3 max-w-2xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className="relative group">
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                        msg.isOwn
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm'
                      }`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setShowReactions(msg.id);
                      }}
                      onClick={() => {
                        if (showReactions === msg.id) setShowReactions(null);
                      }}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className={`text-xs ${msg.isOwn ? 'text-purple-100' : 'text-gray-500'} block mt-1`}>
                        {msg.time}
                      </span>
                    </div>
                    
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="absolute -bottom-3 right-2 flex gap-1 bg-white rounded-full px-2 py-1 shadow-md animate-bounce-in">
                        {msg.reactions.map((emoji, idx) => (
                          <span key={idx} className="text-sm">{emoji}</span>
                        ))}
                      </div>
                    )}

                    {showReactions === msg.id && (
                      <div className="absolute bottom-full mb-2 left-0 bg-white rounded-full shadow-lg px-3 py-2 flex gap-2 animate-scale-in">
                        {reactions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(msg.id, emoji)}
                            className="text-xl hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 bg-white/80 backdrop-blur-lg border-t border-purple-100">
            <div className="flex gap-2 max-w-2xl mx-auto">
              <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                <Icon name="Paperclip" size={20} />
              </Button>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Сообщение..."
                className="flex-1 rounded-full border-purple-200 focus-visible:ring-purple-400"
              />
              <Button 
                onClick={sendMessage}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Мессенджер
              </h1>
              <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                <Icon name="Search" size={20} />
              </Button>
            </div>

            {activeTab === 'stories' && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide animate-fade-in">
                {stories.map((story) => (
                  <div key={story.id} className="flex flex-col items-center min-w-fit">
                    <div className={`p-1 rounded-full ${story.viewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500'}`}>
                      <div className="bg-white p-1 rounded-full">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="text-2xl">{story.avatar}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <span className="text-xs mt-1 text-gray-700">{story.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            {activeTab === 'chats' && (
              <div className="divide-y divide-purple-100 animate-fade-in">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className="flex items-center gap-3 p-4 hover:bg-purple-50/50 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-xl">{chat.avatar}</AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full h-6 min-w-6 flex items-center justify-center text-xs font-semibold px-2">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="p-8 text-center animate-fade-in">
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Контакты</h2>
                <p className="text-gray-600">Здесь будут ваши контакты</p>
              </div>
            )}

            {activeTab === 'stories' && (
              <div className="p-8 text-center animate-fade-in">
                <div className="text-6xl mb-4">📸</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Статусы</h2>
                <p className="text-gray-600">Делитесь моментами с друзьями</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-4 space-y-2 animate-fade-in">
                <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                  <Icon name="User" size={20} className="mr-3" />
                  Профиль
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                  <Icon name="Bell" size={20} className="mr-3" />
                  Уведомления
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                  <Icon name="Lock" size={20} className="mr-3" />
                  Конфиденциальность
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                  <Icon name="Palette" size={20} className="mr-3" />
                  Тема оформления
                </Button>
              </div>
            )}
          </ScrollArea>

          <div className="bg-white/80 backdrop-blur-lg border-t border-purple-100 p-2 shadow-lg">
            <div className="flex justify-around max-w-2xl mx-auto">
              {[
                { id: 'chats' as const, icon: 'MessageCircle', label: 'Чаты' },
                { id: 'contacts' as const, icon: 'Users', label: 'Контакты' },
                { id: 'stories' as const, icon: 'Camera', label: 'Статусы' },
                { id: 'settings' as const, icon: 'Settings', label: 'Настройки' },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                    activeTab === tab.id
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-purple-600'
                  }`}
                >
                  <Icon name={tab.icon as any} size={24} />
                  <span className="text-xs">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
