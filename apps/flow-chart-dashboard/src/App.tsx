import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CardSidebar } from './components/CardSidebar';
import { FlowCanvas } from './components/FlowCanvas';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full flex">
        <CardSidebar />
        <FlowCanvas />
      </div>
      <Toaster />
    </DndProvider>
  );
}