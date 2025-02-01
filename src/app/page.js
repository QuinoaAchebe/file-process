import FileProcessor from '../components/FileProcessor';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-center mb-8">File Processor</h1>
      <FileProcessor />
    </main>
  );
}