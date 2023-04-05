import { TranslateBody } from '@/types/types';
import { OpenAIStream } from '@/utils';
import endent from 'endent';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputTarget, inputCode, model, apiKey } =
      (await req.json()) as TranslateBody;

    let prompt = '';

    if(outputTarget === 'BugFixer') {
      prompt = endent`
        You are an expert programmer in all programming languages. Fix bugs in the below ${inputLanguage} code. Do not include \`\`\`.
    
        Fix Python example:
    
        ### Buggy Python:
        import Random
        a = random.randint(1,12)
        b = random.randint(1,12)
        for i in range(10):
          question = "What is "+a+" x "+b+"? "
          answer = input(question)
          if answer = a*b
              print (Well done!)
          else:
              print("No.")
    
        ### Fixed Python:
        import random
        a = random.randint(1,12)
        b = random.randint(1,12)
        for i in range(10):
          question = "What is "+str(a)+" x "+str(b)+"? "
          answer = int(input(question))
          if answer == a*b:
              print ("Well done!")
          else:
              print("No.")
        
        ### Buggy ${inputLanguage} (no \`\`\`):
        ${inputCode}

        ### Fixed ${inputLanguage} (no \`\`\`):
      `;
    }

    if(outputTarget === 'ExplainCode') {
      prompt = endent`
        You are an expert programmer in all programming languages. Explain the following ${inputLanguage} code. Do not include \`\`\`.
    
        Explain examples of Python code:

        ### Python code (no \`\`\`):
        class Log:
          def __init__(self, path):
            dirname = os.path.dirname(path)
            os.makedirs(dirname, exist_ok=True)
            f = open(path, "a+")

            # Check that the file is newline-terminated
            size = os.path.getsize(path)
            if size > 0:
              f.seek(size - 1)
              end = f.read(1)
              if end != "\n":
                f.write("\n")
            self.f = f
            self.path = path

            def log(self, event):
              event["_event_id"] = str(uuid.uuid4())
              json.dump(event, self.f)
              self.f.write("\n")

            def state(self):
              state = {"complete": set(), "last": None}
              for line in open(self.path):
                event = json.loads(line)
                if event["type"] == "submit" and event["success"]:
                  state["complete"].add(event["id"])
                  state["last"] = event
              return state
        
        ### answer:
        Here's what the above class is doing, explained in a concise way:
        1.
        
        ### ${inputLanguage} code (no \`\`\`):
        ${inputCode}

        ### answer:
      `;
    }

    if(outputTarget === 'RefactorCode') {
      prompt = endent`
        You are an expert programmer in all programming languages. Refactor the following ${inputLanguage} code. Do not include \`\`\`.
    
        Refactor examples of Python code:

        ### Python code (no \`\`\`):
        def get_user_info(user_id):
          user = get_user(user_id)
          if user is None:
            return None
          else:
            return {
              "name": user.name,
              "email": user.email,
              "phone": user.phone,
              "address": user.address,
              "city": user.city,
              "state": user.state,
              "zip": user.zip,
            }

        ### Result (no \`\`\`):
        def get_user_info_dict(user_id):
          user = get_user(user_id)
          return {
              "name": user.name,
              "email": user.email,
              "phone": user.phone,
              "address": user.address,
              "city": user.city,
              "state": user.state,
              "zip": user.zip,
          } if user else None
        
        ### ${inputLanguage} code (no \`\`\`):
        ${inputCode}

        ### Result (no \`\`\`):
      `;
    }

    const system = { role: 'system', content: prompt };

    const stream = await OpenAIStream(model, [system], apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;



