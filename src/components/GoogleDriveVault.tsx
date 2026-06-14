import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  Cloud, 
  FolderOpen, 
  FileText, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  Check, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  listReportsOnDrive, 
  deleteReportFromDrive, 
  DriveFile,
  DRIVE_SCOPE 
} from '../utils/googleDrive';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Configure Google Auth Provider for Drive
const driveProvider = new GoogleAuthProvider();
driveProvider.addScope(DRIVE_SCOPE);

interface GoogleDriveVaultProps {
  driveToken: string | null;
  setDriveToken: (token: string | null) => void;
  onRequestUploadCurrent?: () => Promise<void>;
  hasCurrentReportToUpload?: boolean;
}

export default function GoogleDriveVault({ 
  driveToken, 
  setDriveToken, 
  onRequestUploadCurrent,
  hasCurrentReportToUpload = false
}: GoogleDriveVaultProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

  // Authenticate user with Google Drive scope
  const handleConnectDrive = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, driveProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('No access token returned. Please ensure Google Drive permissions are authorized.');
      }
      setDriveToken(credential.accessToken);
      setStatusMessage('Successfully authorized Google Drive Vault!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Google Drive Auth Error:', err);
      setError(err.message || 'Authorization failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectDrive = () => {
    setDriveToken(null);
    setFiles([]);
    setError(null);
    setStatusMessage('Disconnected Google Drive storage.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Sync / Load files from Google Drive
  const loadDriveFiles = async (tokenStr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const driveFiles = await listReportsOnDrive(tokenStr);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error listing drive files:', err);
      setError(err.message || 'Failed to sync with Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger manual sync
  const handleSync = () => {
    if (driveToken) {
      loadDriveFiles(driveToken);
    }
  };

  // Handle destructive file deletion - REQUIRES MANDATORY EXPLICIT USER CONFIRMATION Dialog
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!driveToken) return;
    
    setIsDeletingId(fileId);
    setError(null);
    
    try {
      await deleteReportFromDrive(driveToken, fileId);
      setStatusMessage(`Successfully deleted "${fileName}" from Google Drive.`);
      setShowDeleteConfirmId(null);
      // Reload lists
      await loadDriveFiles(driveToken);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(err.message || 'An error occurred while deleting the file from Google Drive.');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Load files when token is retrieved
  useEffect(() => {
    if (driveToken) {
      loadDriveFiles(driveToken);
    }
  }, [driveToken]);

  const formatBytes = (bytesStr?: string) => {
    if (!bytesStr) return 'Unknown size';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section 
      id="google-drive-vault-panel" 
      className="bg-[#faf8f5] border border-amber-900/15 rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Premium traditional header */}
      <div className="bg-gradient-to-r from-[#2c1b10] via-[#442614] to-[#2c1b10] p-5 text-white border-b border-amber-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#dac3a3] uppercase block font-black">
              VAIDYA STORAGE SYSTEM
            </span>
            <h3 className="text-lg font-serif font-black tracking-wide text-amber-50 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-300" /> SECURE GOOGLE DRIVE VAULT
            </h3>
            <p className="text-[11px] text-stone-300 font-serif">
              Sync and archive your personal Tridosha constitutional reports in your dedicated 'Mangalam Ayurveda' folder.
            </p>
          </div>

          <div className="flex items-center shrink-0">
            {driveToken ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-mono font-black uppercase rounded">
                  <Check className="w-3 h-3" /> ACTIVE STORAGE
                </span>
                <button
                  onClick={handleDisconnectDrive}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  DISCONNECT
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectDrive}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center cursor-pointer select-none border border-amber-900/20 bg-white hover:bg-amber-50 text-[#1f1f1f] rounded-lg px-3.5 py-1.5 transition-all active:scale-98 shadow-2xs text-[10px] font-mono font-black uppercase tracking-wider gap-2 animate-pulse hover:animate-none"
              >
                <div className="w-4 h-4 shrink-0">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span>CONNECT GOOGLE DRIVE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main body content */}
      <div className="p-5 space-y-4">
        {/* Status notifications */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-950 rounded-xl text-xs font-serif flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Google Drive Connection Alert:</strong> {error}
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-serif flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">System Status:</strong> {statusMessage}
            </div>
          </div>
        )}

        {/* Not Connected State */}
        {!driveToken && (
          <div className="text-center py-8 px-4 border border-dashed border-amber-900/10 rounded-2xl bg-amber-500/[0.02] space-y-3">
            <FolderOpen className="w-10 h-10 text-amber-900/35 mx-auto" />
            <h4 className="font-serif font-black text-amber-955 text-sm uppercase tracking-wide">
              Cloud Diagnostics Archive is Locked
            </h4>
            <p className="text-xs text-stone-500 font-serif max-w-md mx-auto leading-relaxed">
              Connect your Google Workspace Drive securely above to save generated health reports directly to a customized 'Mangalam Ayurveda' cloud directory. You can list, download, organize, and manage your traditional health transcripts dynamically.
            </p>
            <div className="text-[10px] font-mono text-amber-800 bg-amber-50 rounded border border-amber-900/5 max-w-sm mx-auto p-2 leading-normal">
              🔒 Standard Google scopes protect your security; files can be managed transparently at any time.
            </div>
          </div>
        )}

        {/* Connected State */}
        {driveToken && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-3 border-b border-amber-900/10 pb-2">
              <h4 className="font-serif font-black text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-amber-800" /> Mangalam Ayurveda Folders Matrix
              </h4>
              <button
                onClick={handleSync}
                disabled={isLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[9.5px] text-amber-900 hover:text-white bg-amber-50 hover:bg-amber-900 border border-amber-900/20 hover:border-amber-900 rounded font-mono font-bold uppercase transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Sync Drive
              </button>
            </div>

            {/* Quick Upload Active Report if available */}
            {hasCurrentReportToUpload && onRequestUploadCurrent && (
              <div className="p-3.5 bg-amber-50/75 border border-amber-900/15 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-serif font-bold text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Local Constitutional Report Available
                  </p>
                  <p className="text-[10.5px] text-stone-600 font-serif leading-snug">
                    You have active Nadi Pariksha results computed on this terminal. Save them directly of your Drive directory!
                  </p>
                </div>
                <button
                  onClick={onRequestUploadCurrent}
                  disabled={isLoading}
                  className="bg-amber-900 hover:bg-[#2d1b10] disabled:bg-amber-900/60 text-[#faf2e6] text-[10px] font-mono font-black uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
                >
                  {isLoading ? 'Uploading...' : 'Save to Google Drive'}
                </button>
              </div>
            )}

            {/* Loading placeholder */}
            {isLoading && files.length === 0 && (
              <div className="text-center py-6">
                <div className="w-5 h-5 border-2 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-serif text-stone-500">Querying secure API repository...</p>
              </div>
            )}

            {/* Files List */}
            {!isLoading && files.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-stone-200 rounded-xl bg-stone-50">
                <FileText className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                <p className="text-xs font-serif text-stone-600 font-bold">No reports uploaded yet</p>
                <p className="text-[10px] font-serif text-stone-400 max-w-xs mx-auto mt-0.5">
                  Your PDF reports saved from the Dosha Assessment results page will show up here as safe copies.
                </p>
              </div>
            ) : (
              files.length > 0 && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {files.map((file) => (
                    <div 
                      key={file.id}
                      className="group/item relative flex items-center justify-between p-3 bg-white hover:bg-amber-500/[0.02] border border-stone-200 hover:border-amber-900/15 rounded-xl transition-all shadow-3xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11.5px] font-serif font-black text-stone-800 leading-snug break-all max-w-[180px] sm:max-w-md truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[9.5px] text-stone-400 font-mono tracking-wide">
                            <span>{formatDate(file.createdTime)}</span>
                            <span>•</span>
                            <span>{formatBytes(file.size)}</span>
                          </div>
                        </div>
                      </div>

                      {/* File Controls */}
                      <div className="flex items-center gap-1 shrink-0 z-20">
                        <a 
                          href={file.webViewLink} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-stone-100 text-stone-700 hover:text-stone-900 rounded-md border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="View directly on Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Custom confirmation design for destructive item deleting - satisfying the User Confirmation guidelines */}
                        {showDeleteConfirmId === file.id ? (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-red-200 text-stone-850 p-2.5 rounded-xl shadow-lg z-30 flex items-center gap-2 text-[10px] font-serif animate-slideIn">
                            <span className="font-bold text-red-800">Confirm delete?</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteFile(file.id, file.name)}
                                disabled={isDeletingId === file.id}
                                className="bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 font-sans font-bold rounded uppercase text-[9px] cursor-pointer"
                              >
                                {isDeletingId === file.id ? '...' : 'YES'}
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirmId(null)}
                                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 font-sans font-medium rounded uppercase text-[9px] cursor-pointer"
                              >
                                NO
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirmId(file.id)}
                            className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-700 rounded-md border border-stone-200 hover:border-red-100 transition-colors cursor-pointer"
                            title="Delete report from Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Quick Informational Tip */}
            <div className="text-[9.5px] text-stone-500 bg-stone-100/70 p-2 rounded-lg flex items-start gap-1.5 font-serif leading-relaxed">
              <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>We store your data securely inside a custom folder on your Drive storage. Sharing permissions are managed natively in your Workspace console.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
