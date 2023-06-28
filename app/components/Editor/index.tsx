import Editor from '@monaco-editor/react';


export const MyEditor = ({ setValue, height }: { setValue: any, height: number | string }) => {
  const onChange = (value: any, event: any) => {
    setValue(value)
  }
  return <Editor theme={"light"} language={"javascript"} loading={"加载中..."} height={height} defaultLanguage="javascript" defaultValue="" onChange={onChange} />;
}