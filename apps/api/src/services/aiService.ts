import { AzureOpenAI } from 'openai';

const openai = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || "https://testconsulting.services.ai.azure.com/",
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-01",
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
});

const SYSTEM_PROMPT = `You are the MezoOS treasury assistant for a Bitcoin-native operating account.
Your job is to help users manage BTC-backed MUSD operations safely and clearly.
You must:
- be concise and action-oriented
- explain decisions in plain English
- never claim to execute blockchain transactions
- help draft invoices, summarize treasury state, and recommend payment actions
- consider available MUSD balance, treasury health factor, recurring obligations, and due dates
- prioritize user safety when treasury health is weak
- format outputs as structured JSON when requested`;

export const handleAiInvoice = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Parse the following into a structured JSON invoice. Return ONLY JSON matching { recipientWallet, amount, dueDate, memo }. Input: ${prompt}` }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};

export const handleAiSummary = async (treasury: any) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Summarize the following treasury state in 2-3 sentences and suggest next actions. Treasury: ${JSON.stringify(treasury)}` }
    ]
  });

  return { summary: response.choices[0].message.content };
};

export const handleAiPayment = async (data: any) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Give a payment recommendation (pay_now, defer, or pause) and a brief rationale based on this data: ${JSON.stringify(data)}. Return ONLY JSON matching { recommendation, rationale }.` }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};
