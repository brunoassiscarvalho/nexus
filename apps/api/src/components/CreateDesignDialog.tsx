import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface CreateDesignDialogProps {
  open: boolean;
  onConfirm: (name: string, description: string) => void;
  onCancel: () => void;
}

export function CreateDesignDialog({ open, onConfirm, onCancel }: CreateDesignDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    if (name.trim() && description.trim()) {
      onConfirm(name.trim(), description.trim());
      // Reset form
      setName('');
      setDescription('');
    }
  };

  const handleCancel = () => {
    onCancel();
    // Reset form
    setName('');
    setDescription('');
  };

  const isValid = name.trim() !== '' && description.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogDescription>
            Enter a name and description for your new system design.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="design-name">Name *</Label>
            <Input
              id="design-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., E-commerce Platform"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isValid) {
                  handleConfirm();
                }
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="design-description">Description *</Label>
            <Textarea
              id="design-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your system architecture..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            Create Design
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
