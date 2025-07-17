'use client';

import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  StopScreenShare,
  Settings,
  People,
  Chat,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';

interface VideoCallProps {
  roomUrl: string;
  token?: string;
  userName: string;
  userRole: 'client' | 'nutritionist';
  consultationId: string;
  onCallEnd?: () => void;
  onCallStart?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  roomUrl,
  token,
  userName,
  userRole,
  consultationId,
  onCallEnd,
  onCallStart,
}) => {
  const callFrameRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [callState, setCallState] = useState<string>('not-joined');
  const [participants, setParticipants] = useState<any[]>([]);
  const [localParticipant, setLocalParticipant] = useState<any>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<string>('good');

  useEffect(() => {
    if (!callFrameRef.current) return;

    // Create Daily call frame
    const frame = DailyIframe.createFrame(callFrameRef.current, {
      showLeaveButton: false,
      showFullscreenButton: false,
      showLocalVideo: true,
      showParticipantsBar: false,
      theme: {
        colors: {
          accent: '#2E7D32',
          accentText: '#ffffff',
          background: '#f5f5f5',
          backgroundAccent: '#e8f5e8',
          baseText: '#000000',
          border: '#cccccc',
          mainAreaBg: '#ffffff',
          mainAreaBgAccent: '#f0f0f0',
          mainAreaText: '#000000',
          supportiveText: '#666666',
        },
      },
    });

    // Event listeners
    frame.on('joined-meeting', (event: any) => {
      setCallState('joined');
      setLocalParticipant(event.participants.local);
      onCallStart?.();
    });

    frame.on('left-meeting', () => {
      setCallState('left');
      onCallEnd?.();
    });

    frame.on('participant-joined', (event: any) => {
      setParticipants(prev => [...prev, event.participant]);
    });

    frame.on('participant-left', (event: any) => {
      setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
    });

    frame.on('participant-updated', (event: any) => {
      if (event.participant.local) {
        setLocalParticipant(event.participant);
        setIsVideoEnabled(event.participant.video);
        setIsAudioEnabled(event.participant.audio);
      }
    });

    frame.on('error', (event: any) => {
      setError(event.error);
      console.error('Daily.co error:', event.error);
    });

    frame.on('network-quality-change', (event: any) => {
      setConnectionQuality(event.quality);
    });

    frame.on('screen-share-started', () => {
      setIsScreenSharing(true);
    });

    frame.on('screen-share-stopped', () => {
      setIsScreenSharing(false);
    });

    setCallFrame(frame);

    return () => {
      if (frame) {
        frame.destroy();
      }
    };
  }, [onCallEnd, onCallStart]);

  const joinCall = async () => {
    if (!callFrame) return;

    try {
      setCallState('joining');
      await callFrame.join({
        url: roomUrl,
        token: token,
        userName: userName,
        userData: {
          role: userRole,
          consultationId: consultationId,
        },
      });
    } catch (error) {
      setError('Failed to join call');
      console.error('Join call error:', error);
      setCallState('error');
    }
  };

  const leaveCall = async () => {
    if (!callFrame) return;

    try {
      await callFrame.leave();
    } catch (error) {
      console.error('Leave call error:', error);
    }
  };

  const toggleVideo = async () => {
    if (!callFrame) return;

    try {
      await callFrame.setLocalVideo(!isVideoEnabled);
    } catch (error) {
      console.error('Toggle video error:', error);
    }
  };

  const toggleAudio = async () => {
    if (!callFrame) return;

    try {
      await callFrame.setLocalAudio(!isAudioEnabled);
    } catch (error) {
      console.error('Toggle audio error:', error);
    }
  };

  const toggleScreenShare = async () => {
    if (!callFrame) return;

    try {
      if (isScreenSharing) {
        await callFrame.stopScreenShare();
      } else {
        await callFrame.startScreenShare();
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!callFrameRef.current) return;

    if (!isFullscreen) {
      callFrameRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'good':
        return 'success';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCallStateMessage = () => {
    switch (callState) {
      case 'not-joined':
        return 'Ready to join consultation';
      case 'joining':
        return 'Joining consultation...';
      case 'joined':
        return 'Consultation in progress';
      case 'left':
        return 'Consultation ended';
      case 'error':
        return 'Connection error';
      default:
        return 'Unknown state';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Video Consultation
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={getCallStateMessage()}
                color={callState === 'joined' ? 'success' : 'default'}
                size="small"
              />
              {callState === 'joined' && (
                <Chip
                  label={`${participants.length + 1} participant${participants.length > 0 ? 's' : ''}`}
                  variant="outlined"
                  size="small"
                />
              )}
              <Chip
                label={connectionQuality}
                color={getConnectionQualityColor(connectionQuality) as any}
                size="small"
              />
            </Box>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Professional consultation with Gouri Priya Mylavarapu
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Video Frame */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: '#000' }}>
        <div
          ref={callFrameRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 0,
          }}
        />
        
        {/* Pre-join screen */}
        {callState === 'not-joined' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Ready to join consultation?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              You're about to join a video consultation with {userRole === 'client' ? 'Gouri Priya Mylavarapu' : 'your client'}.
              <br />
              Make sure your camera and microphone are working properly.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={joinCall}
              startIcon={<Videocam />}
              sx={{
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#1B5E20' },
              }}
            >
              Join Consultation
            </Button>
          </Box>
        )}

        {/* Joining screen */}
        {callState === 'joining' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            <CircularProgress sx={{ mb: 2, color: 'white' }} />
            <Typography variant="h6">
              Joining consultation...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Controls */}
      {callState === 'joined' && (
        <Paper sx={{ p: 2, borderRadius: 0, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Tooltip title={isAudioEnabled ? 'Mute' : 'Unmute'}>
              <IconButton
                onClick={toggleAudio}
                sx={{
                  bgcolor: isAudioEnabled ? 'transparent' : 'error.main',
                  color: isAudioEnabled ? 'text.primary' : 'white',
                  '&:hover': {
                    bgcolor: isAudioEnabled ? 'action.hover' : 'error.dark',
                  },
                }}
              >
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
              <IconButton
                onClick={toggleVideo}
                sx={{
                  bgcolor: isVideoEnabled ? 'transparent' : 'error.main',
                  color: isVideoEnabled ? 'text.primary' : 'white',
                  '&:hover': {
                    bgcolor: isVideoEnabled ? 'action.hover' : 'error.dark',
                  },
                }}
              >
                {isVideoEnabled ? <Videocam /> : <VideocamOff />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
              <IconButton
                onClick={toggleScreenShare}
                sx={{
                  bgcolor: isScreenSharing ? 'primary.main' : 'transparent',
                  color: isScreenSharing ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isScreenSharing ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <IconButton onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton onClick={() => setShowSettings(true)}>
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title="End call">
              <IconButton
                onClick={leaveCall}
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  ml: 2,
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                }}
              >
                <CallEnd />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Professional disclaimer */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Professional consultation in progress • All conversations are confidential
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Call Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Connection Quality</Typography>
            <Chip
              label={`${connectionQuality} connection`}
              color={getConnectionQualityColor(connectionQuality) as any}
            />
            
            <Typography variant="h6">Consultation Info</Typography>
            <Typography variant="body2">
              Consultation ID: {consultationId}
            </Typography>
            <Typography variant="body2">
              User Role: {userRole}
            </Typography>
            <Typography variant="body2">
              Participants: {participants.length + 1}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoCall;