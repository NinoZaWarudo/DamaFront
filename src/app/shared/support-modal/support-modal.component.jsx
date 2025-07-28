import React, { useState, useEffect } from 'react';

const SupportModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('main');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setView('main');
      setMessage('');
      setStatusMessage('');
    } else {
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  console.log('SupportModal: Tentativo di renderizzazione. isOpen:', isOpen, 'isAnimating:', isAnimating);


  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log('Messaggio di problema inviato:', message);
    setStatusMessage('Grazie per la segnalazione! Il tuo messaggio è stato inviato.');
    setMessage('');
    setTimeout(() => {
      setStatusMessage('');
      setView('main');
      onClose();
    }, 2000);
  };

  const predefinedEmail = 'support@thenewdama.com';
  const predefinedPhone = '+39 081 1234567';

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-red-500 bg-opacity-100 rounded-xl shadow-2xl p-8 w-full max-w-lg text-center relative transform transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setView('main');
            onClose();
          }}
          className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
        >
          &times;
        </button>

        {statusMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{statusMessage}</span>
          </div>
        )}

        {view === 'main' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Supporto</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setView('reportProblem')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Segnala un problema
              </button>
              <button
                onClick={() => setView('contactUs')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Contattaci
              </button>
            </div>
          </div>
        )}

        {view === 'reportProblem' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Segnala un problema</h2>
            <form onSubmit={handleReportSubmit}>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white bg-opacity-80"
                placeholder="Descrivi il tuo problema qui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 w-full"
              >
                Invia
              </button>
            </form>
            <button
              onClick={() => {
                setView('main');
                setStatusMessage('');
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Torna indietro
            </button>
          </div>
        )}

        {view === 'contactUs' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Contattaci</h2>
            <p className="text-lg text-gray-700 mb-4">
              Email: <a href={`mailto:${predefinedEmail}`} className="text-blue-600 hover:underline">{predefinedEmail}</a>
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Telefono: <a href={`tel:${predefinedPhone.replace(/\s/g, '')}`} className="text-blue-600 hover:underline">{predefinedPhone}</a>
            </p>
            <button
              onClick={() => setView('main')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Torna indietro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportModal;
