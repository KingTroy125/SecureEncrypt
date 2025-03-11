import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Key, Copy, Download, Upload, Trash2, Save, FileText, Shield } from 'lucide-react';
import { encryptText, decryptText, generateRandomKey } from './utils/cryptoUtils';
import HomePage from './components/HomePage';

function App() {
  const [text, setText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [key, setKey] = useState('');
  const [savedKeys, setSavedKeys] = useState<{ name: string; key: string }[]>([]);
  const [selectedKeyName, setSelectedKeyName] = useState('');
  const [keyName, setKeyName] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [notification, setNotification] = useState('');
  const [showHomePage, setShowHomePage] = useState(true);

  // Load saved keys from localStorage on component mount
  useEffect(() => {
    const keys = localStorage.getItem('encryptionKeys');
    if (keys) {
      setSavedKeys(JSON.parse(keys));
    }
  }, []);

  // Save keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('encryptionKeys', JSON.stringify(savedKeys));
  }, [savedKeys]);

  const handleEncrypt = () => {
    if (!text) {
      showNotification('Please enter text to encrypt');
      return;
    }
    if (!key) {
      showNotification('Please enter or generate a key');
      return;
    }

    try {
      const encrypted = encryptText(text, key);
      setEncryptedText(encrypted);
      setDecryptedText('');
      showNotification('Text encrypted successfully');
    } catch (error) {
      showNotification('Encryption failed. Please check your input.');
    }
  };

  const handleDecrypt = () => {
    if (!encryptedText) {
      showNotification('Please enter text to decrypt');
      return;
    }
    if (!key) {
      showNotification('Please enter a key');
      return;
    }

    try {
      const decrypted = decryptText(encryptedText, key);
      setDecryptedText(decrypted);
      showNotification('Text decrypted successfully');
    } catch (error) {
      showNotification('Decryption failed. Please check your key and encrypted text.');
    }
  };

  const handleGenerateKey = () => {
    const newKey = generateRandomKey();
    setKey(newKey);
    showNotification('New key generated');
  };

  const handleSaveKey = () => {
    if (!key) {
      showNotification('Please generate or enter a key first');
      return;
    }
    if (!keyName) {
      showNotification('Please enter a name for your key');
      return;
    }
    if (savedKeys.some(k => k.name === keyName)) {
      showNotification('A key with this name already exists');
      return;
    }

    setSavedKeys([...savedKeys, { name: keyName, key }]);
    setKeyName('');
    showNotification('Key saved successfully');
  };

  const handleSelectKey = (name: string) => {
    const selectedKey = savedKeys.find(k => k.name === name);
    if (selectedKey) {
      setKey(selectedKey.key);
      setSelectedKeyName(name);
      showNotification(`Key "${name}" selected`);
    }
  };

  const handleDeleteKey = (name: string) => {
    setSavedKeys(savedKeys.filter(k => k.name !== name));
    if (selectedKeyName === name) {
      setSelectedKeyName('');
    }
    showNotification(`Key "${name}" deleted`);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (mode === 'encrypt') {
        setText(content);
      } else {
        setEncryptedText(content);
      }
      showNotification('File loaded successfully');
    };
    reader.readAsText(file);
  };

  const handleDownload = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('File downloaded');
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  if (showHomePage) {
    return <HomePage onGetStarted={() => setShowHomePage(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowHomePage(true)}>
            <Shield className="h-6 w-6" />
            <h1 className="text-xl font-bold">SecureEncrypt</h1>
          </div>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md transition ${
                mode === 'encrypt'
                  ? 'bg-white text-indigo-600 font-medium'
                  : 'text-white hover:bg-indigo-500'
              }`}
              onClick={() => setMode('encrypt')}
            >
              <div className="flex items-center space-x-1">
                <Lock className="h-4 w-4" />
                <span>Encrypt</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${
                mode === 'decrypt'
                  ? 'bg-white text-indigo-600 font-medium'
                  : 'text-white hover:bg-indigo-500'
              }`}
              onClick={() => setMode('decrypt')}
            >
              <div className="flex items-center space-x-1">
                <Unlock className="h-4 w-4" />
                <span>Decrypt</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow flex flex-col md:flex-row gap-4">
        {/* Left Panel - Input */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            {mode === 'encrypt' ? (
              <>
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Text to Encrypt
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2 text-indigo-600" />
                Encrypted Text
              </>
            )}
          </h2>

          <div className="mb-4">
            <textarea
              className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={mode === 'encrypt' ? "Enter text to encrypt..." : "Enter encrypted text..."}
              value={mode === 'encrypt' ? text : encryptedText}
              onChange={(e) => mode === 'encrypt' ? setText(e.target.value) : setEncryptedText(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
            >
              {mode === 'encrypt' ? (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Encrypt</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Decrypt</span>
                </>
              )}
            </button>
            <button
              className="flex items-center space-x-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              onClick={() => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.click();
              }}
            >
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".txt"
              />
            </button>
          </div>
        </div>

        {/* Right Panel - Output and Key Management */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              {mode === 'encrypt' ? (
                <>
                  <Lock className="h-5 w-5 mr-2 text-indigo-600" />
                  Encrypted Result
                </>
              ) : (
                <>
                  <Unlock className="h-5 w-5 mr-2 text-indigo-600" />
                  Decrypted Result
                </>
              )}
            </h2>

            <div className="mb-4">
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                placeholder={mode === 'encrypt' ? "Encrypted text will appear here..." : "Decrypted text will appear here..."}
                value={mode === 'encrypt' ? encryptedText : decryptedText}
                readOnly
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center space-x-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                onClick={() => handleCopyToClipboard(mode === 'encrypt' ? encryptedText : decryptedText)}
                disabled={mode === 'encrypt' ? !encryptedText : !decryptedText}
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                className="flex items-center space-x-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                onClick={() => handleDownload(
                  mode === 'encrypt' ? encryptedText : decryptedText,
                  mode === 'encrypt' ? 'encrypted.txt' : 'decrypted.txt'
                )}
                disabled={mode === 'encrypt' ? !encryptedText : !decryptedText}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Key Management Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Key className="h-5 w-5 mr-2 text-indigo-600" />
              Key Management
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Encryption Key</label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter or generate a key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <button
                  className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700 transition"
                  onClick={handleGenerateKey}
                >
                  <div className="flex items-center">
                    <Key className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Generate</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Save Current Key</label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter key name..."
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
                <button
                  className="bg-green-600 text-white px-3 py-2 rounded-r-md hover:bg-green-700 transition"
                  onClick={handleSaveKey}
                >
                  <div className="flex items-center">
                    <Save className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Save</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saved Keys</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {savedKeys.length === 0 ? (
                  <p className="text-gray-500 p-3 text-sm">No saved keys yet</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {savedKeys.map((savedKey) => (
                      <li key={savedKey.name} className="p-2 hover:bg-gray-50 flex justify-between items-center">
                        <button
                          className={`text-left flex-grow py-1 px-2 rounded ${
                            selectedKeyName === savedKey.name ? 'bg-indigo-100 text-indigo-700' : ''
                          }`}
                          onClick={() => handleSelectKey(savedKey.name)}
                        >
                          {savedKey.name}
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1"
                          onClick={() => handleDeleteKey(savedKey.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg transition-opacity">
          {notification}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>SecureEncrypt - AES-256 Encryption Tool &copy; {new Date().getFullYear()}</p>
        <p className="text-gray-400 text-xs mt-1">
          All encryption and decryption is performed locally in your browser. Your data never leaves your device.
        </p>
      </footer>
    </div>
  );
}

export default App;