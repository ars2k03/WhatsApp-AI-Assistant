import { BufferJSON, initAuthCreds, type AuthenticationCreds, type AuthenticationState, type proto, type SignalDataTypeMap } from "@whiskeysockets/baileys";
import { Collection } from "mongodb";

export const useMongoAuthState = async (
  collection: Collection
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {

  const writeData = async (id: string, data: object) => {
    await collection.updateOne(
      { _id: id as any },
      { $set: { data: JSON.stringify(data, BufferJSON.replacer) } },
      { upsert: true }
    );
  };

  const readData = async (id: string) => {
    const doc = await collection.findOne({ _id: id as any });
    if (!doc) return null;
    return JSON.parse(doc.data, BufferJSON.reviver);
  };

  const removeData = async (id: string) => {
    await collection.deleteOne({ _id: id as any });
  };

  const creds: AuthenticationCreds =
    (await readData("creds")) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: Record<string, SignalDataTypeMap[typeof type]> = {};
          await Promise.all(
            ids.map(async (id) => {
              const value = await readData(`${type}-${id}`);
              if (value) data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          await Promise.all(
            Object.entries(data).flatMap(([type, ids]) =>
              Object.entries(ids as object).map(([id, value]) =>
                value
                  ? writeData(`${type}-${id}`, value)
                  : removeData(`${type}-${id}`)
              )
            )
          );
        },
      },
    },
    saveCreds: async () => {
      await writeData("creds", creds);
    },
  };
};