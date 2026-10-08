// ============================================================
// DrumPro Academy - Pantalla de Videollamada
// Fase 7: Videollamada en Vivo
// Interfaz profesional con controles completos
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { Clase, UserProfile } from '../../../types/academy';

interface VideoCallScreenProps {
  clase: Clase;
  currentUser: UserProfile;
  otherUser: UserProfile;
  onEndCall: () => void;
}

export default function VideoCallScreen({ clase, currentUser, otherUser, onEndCall }: VideoCallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [callDuration, setCallDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [professorNotes, setProfessorNotes] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const callTimerRef = useRef<number | null>(null);

  // Timer de duración de llamada
  useEffect(() => {
    callTimerRef.current = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  // Timer de grabación
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simular calidad de conexión
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.9) setConnectionQuality('poor');
      else if (random > 0.7) setConnectionQuality('good');
      else setConnectionQuality('excellent');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enviar mensaje de chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      message: newMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simular respuesta automática después de 2 segundos
    setTimeout(() => {
      const autoResponse = {
        id: (Date.now() + 1).toString(),
        userId: otherUser.id,
        userName: otherUser.fullName,
        message: 'Entendido, continuemos con el ejercicio.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, autoResponse]);
    }, 2000);
  };

  // Toggle grabación
  const toggleRecording = () => {
    if (!isRecording) {
      if (confirm('¿Iniciar grabación de la clase?')) {
        setIsRecording(true);
      }
    } else {
      if (confirm('¿Detener grabación?')) {
        setIsRecording(false);
      }
    }
  };

  // Finalizar llamada
  const handleEndCall = () => {
    if (isRecording) {
      if (!confirm('La grabación se detendrá. ¿Continuar?')) return;
    }
    onEndCall();
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return '📶';
      case 'good': return '📵';
      case 'poor': return '⚠️';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-white font-bold">{clase.titulo}</h2>
            <p className="text-gray-400 text-sm">
              {currentUser.fullName} ↔ {otherUser.fullName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${getConnectionColor()}`}>
            <span>{getConnectionIcon()}</span>
            <span className="text-sm">{connectionQuality === 'excellent' ? 'Excelente' : connectionQuality === 'good' ? 'Buena' : 'Mala'}</span>
          </div>
          <div className="text-white font-mono text-lg">
            {formatTime(callDuration)}
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-mono">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Área principal de video */}
      <div className="flex-1 flex">
        {/* Videos */}
        <div className="flex-1 relative bg-black">
          {/* Video del otro usuario (grande) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-6xl mb-4">
                  {otherUser.fullName.charAt(0)}
                </div>
                <p className="text-gray-400 text-lg">{otherUser.fullName}</p>
                <p className="text-gray-500 text-sm">Cámara desactivada</p>
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center text-8xl mb-4">
                    {otherUser.fullName.charAt(0)}
                  </div>
                  <p className="text-white text-xl font-medium">{otherUser.fullName}</p>
                  <p className="text-white/60 text-sm mt-2">Video simulado</p>
                </div>
              </div>
            )}
          </div>

          {/* Video del usuario actual (pequeño, esquina) */}
          <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl mb-2">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <p className="text-gray-400 text-xs">Sin video</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-4xl mb-2">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <p className="text-white text-sm">{currentUser.fullName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Indicador de mute */}
          {isMuted && (
            <div className="absolute top-6 left-6 bg-red-600 px-3 py-2 rounded-lg flex items-center gap-2">
              <span className="text-white">🔇</span>
              <span className="text-white text-sm">Silenciado</span>
            </div>
          )}

          {/* Indicador de compartir pantalla */}
          {isScreenSharing && (
            <div className="absolute top-6 right-6 bg-blue-600 px-3 py-2 rounded-lg flex items-center gap-2">
              <span className="text-white">🖥️</span>
              <span className="text-white text-sm">Compartiendo pantalla</span>
            </div>
          )}
        </div>

        {/* Panel lateral (Chat o Notas) */}
        {(showChat || showNotes) && (
          <div className="w-96 bg-gray-800 flex flex-col">
            {showChat && (
              <>
                <div className="px-4 py-3 bg-gray-700 flex items-center justify-between">
                  <h3 className="text-white font-bold">💬 Chat</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-2">💬</div>
                      <p>No hay mensajes aún</p>
                    </div>
                  ) : (
                    chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            msg.userId === currentUser.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <div className="text-xs opacity-70 mb-1">{msg.userName}</div>
                          <div>{msg.message}</div>
                          <div className="text-xs opacity-50 mt-1">
                            {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </>
            )}

            {showNotes && currentUser.role === 'profesor' && (
              <>
                <div className="px-4 py-3 bg-gray-700 flex items-center justify-between">
                  <h3 className="text-white font-bold">📝 Notas de Clase</h3>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <textarea
                    value={professorNotes}
                    onChange={(e) => setProfessorNotes(e.target.value)}
                    placeholder="Escribe notas sobre la clase..."
                    className="w-full h-full bg-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controles inferiores */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-center gap-3">
        {/* Mute/Unmute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>

        {/* Video On/Off */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isVideoOff ? 'Activar cámara' : 'Desactivar cámara'}
        >
          {isVideoOff ? '📷' : '📹'}
        </button>

        {/* Compartir pantalla */}
        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isScreenSharing ? 'Dejar de compartir' : 'Compartir pantalla'}
        >
          🖥️
        </button>

        {/* Chat */}
        <button
          onClick={() => {
            setShowChat(!showChat);
            setShowNotes(false);
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title="Chat"
        >
          💬
        </button>

        {/* Notas (solo profesor) */}
        {currentUser.role === 'profesor' && (
          <button
            onClick={() => {
              setShowNotes(!showNotes);
              setShowChat(false);
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
              showNotes ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Notas de clase"
          >
            📝
          </button>
        )}

        {/* Grabar */}
        <button
          onClick={toggleRecording}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
        >
          {isRecording ? '⏹️' : '⏺️'}
        </button>

        {/* Finalizar llamada */}
        <button
          onClick={handleEndCall}
          className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-2xl transition-all"
          title="Finalizar llamada"
        >
          📞
        </button>
      </div>
    </div>
  );
}
