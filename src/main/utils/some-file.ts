export default function getSomeFile(key: string): string {
  const some = import.meta.glob(['../../../resources/build-tools/34.0.0/apksigner*', '../../../resources/jre/bin/java*'], {
    query: '?asset',
    import: 'default',
    eager: true,
  });

  const someFilePath = {};
  Object.keys(some).forEach((key) => {
    if (key.includes('apksigner')) {
      someFilePath['apksigner'] = some[key];
    } else if (key.includes('java')) {
      someFilePath['java'] = some[key];
    }
  });
  return someFilePath[key];
}
