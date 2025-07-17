import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/lib/socket';
import { configureSocketIO } from '@/lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.io already running');
  } else {
    console.log('Configuring Socket.io...');
    const io = configureSocketIO(res.socket.server);
    res.socket.server.io = io;
  }
  
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};