export async function handleConfigListAdd(
  innerConfig: ConfigValue,
  data: { type: "LIST" } & ConfigValue,
  content: any
) {
  const toadd = await getToAdd(innerConfig, data.listtype);
  content.push(toadd);
}

export async function handleNullableAdd(
  config: ConfigValue,
  content: Ref<any>
) {
  const valueToSet = await getToAdd(config, config.nullable);
  content.value = valueToSet;
}

export async function handleConfigMapAdd(
  data: { type: "MAP" } & ConfigValue,
  content: any
) {
  const key = await getToAdd(data.value["0"]);
  const value = await getToAdd(data.value["1"], data.maptype);
  content[key] = value;
}

async function getToAdd(
  innerConfig: ConfigValue,
  genericType?: string
): Promise<any> {
  const type = innerConfig.type;
  const configState = useConfigState();
  let toadd;
  if (type === "LIST") {
    toadd = [];
  } else if (type === "ENUM") {
    toadd = Object.keys(innerConfig.value)[0];
  } else if (type === "CLASS" || type === "SEALED") {
    toadd = await configState.getDefaultData(genericType!);
  } else if (type === "MAP") {
    toadd = {};
  } else if (type === "STRING") {
    toadd = "";
  } else if (type === "INT") {
    toadd = 0;
  } else if (type === "BOOLEAN") {
    toadd = false;
  } else {
    throw new Error("Unknown type: " + type);
  }
  return toadd;
}
