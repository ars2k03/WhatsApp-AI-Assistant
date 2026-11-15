import { BufferJSON, initAuthCreds, type AuthenticationCreds, type AuthenticationState, type SignalDataTypeMap } from "baileys";
import { Collection } from "mongodb";

let allowSave = true;

export const clearAuthState = async (collection: Collection) => {
  allowSave = false;
  await collection.deleteMany({});
};

export const enableAuthSave = () => {
  allowSave = true;
};

export const useMongoAuthState = async (
  collection: Collection
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
  allowSave = true;

  const writeData = async (id: string, data: object) => {
    if (!allowSave) return;
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
    if (!allowSave) return;
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
          if (!allowSave) return;
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
      if (!allowSave) return;
      await writeData("creds", creds);
    },
  };
};
