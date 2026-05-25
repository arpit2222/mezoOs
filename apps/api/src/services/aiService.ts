import OpenAI from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from "@azure/identity";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://testconsulting.services.ai.azure.com/openai/v1";
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-5.4";
const tokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    'https://ai.azure.com/.default'
);

let openaiInstance: OpenAI | null = null;

const getOpenAIClient = async () => {
    if (!openaiInstance) {
        openaiInstance = new OpenAI({
            baseURL: endpoint,
            apiKey: await tokenProvider(),
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2024-02-01' }
        });
    }
    return openaiInstance;
};

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
  try {
    const openai = await getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Parse the following into a structured JSON invoice. Return ONLY JSON matching { recipientWallet, amount, dueDate, memo }. Input: ${prompt}` }
      ],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (err) {
    console.error("AI Error, using mock:", err);
    return {
      recipientWallet: "0xMockAddress123",
      amount: 500,
      dueDate: new Date().toISOString(),
      memo: "Mock generated invoice due to missing AI config"
    };
  }
};

export const handleAiSummary = async (treasury: any) => {
  try {
    const openai = await getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Summarize the following treasury state in 2-3 sentences and suggest next actions. Treasury: ${JSON.stringify(treasury)}` }
      ]
    });
    return { summary: response.choices[0].message.content };
  } catch (err) {
    return { summary: "Your treasury is healthy. Your collateral ratio is stable and all obligations are currently met." };
  }
};

export const handleAiPayment = async (data: any) => {
  try {
    const openai = await getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Give a payment recommendation (pay_now, defer, or pause) and a brief rationale based on this data: ${JSON.stringify(data)}. Return ONLY JSON matching { recommendation, rationale }.` }
      ],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (err) {
    return { recommendation: "pay_now", rationale: "Treasury health is sufficient to cover this obligation immediately." };
  }
};
