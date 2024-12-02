import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodItemFormProps {
  onSubmit: (item: FoodItem) => void;
}

export default function FoodItemForm({ onSubmit }: FoodItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    shelfLife: '',
    category: 'Dairy'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: crypto.randomUUID(),
      quantity: Number(formData.quantity),
      expiryDate: new Date(Date.now() + Number(formData.shelfLife) * 24 * 60 * 60 * 1000),
      humidity: getDefaultHumidity(formData.category)
    } as FoodItem);
    setFormData({ name: '', quantity: '', shelfLife: '', category: 'Dairy' });
  };

  const getDefaultHumidity = (category: string): number => {
    switch (category) {
      case 'Dairy': return 85;
      case 'Meat': return 82;
      case 'Produce': return 90;
      case 'Bakery': return 60;
      default: return 70;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="retro-card p-6">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Add Food Item</h2>
      <div className="space-y-4">
        <div>
          <label className="retro-label">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="retro-input"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="retro-label">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="retro-input"
              required
              min="0"
            />
          </div>
          <div>
            <label className="retro-label">Shelf Life (days)</label>
            <input
              type="number"
              value={formData.shelfLife}
              onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
              className="retro-input"
              required
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="retro-label">Category</label>
            <div className="retro-select-wrapper">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="retro-select"
              >
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Produce">Produce</option>
                <option value="Bakery">Bakery</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" className="retro-button w-full flex items-center justify-center mt-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>
    </form>
  );
}