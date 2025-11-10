// Type definitions for WhatsApp Service
export interface MessageData {
  type: string;
  text?: string;
  template?: {
    name: string;
    language: { code: string };
    components?: any[];
  };
  [key: string]: any;
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

declare class WhatsAppService {
  constructor();
  accessToken: string | undefined;
  phoneNumberId: string | undefined;
  businessPhoneNumber: string;
  apiVersion: string;
  baseUrl: string;

  sendMessage(to: string, messageData: MessageData): Promise<MessageResponse>;
  sendTemplate(to: string, templateName: string, parameters?: any[]): Promise<MessageResponse>;
  sendWelcomeMessage(phoneNumber: string, userName: string): Promise<MessageResponse>;
  sendDietPlan(phoneNumber: string, userName: string, dietPlan: any): Promise<MessageResponse>;
  logMessage(data: any): Promise<void>;
  getMessageStatus(messageId: string): Promise<any>;
}

export = WhatsAppService;
