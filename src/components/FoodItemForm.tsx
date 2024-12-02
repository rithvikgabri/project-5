import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FoodItem, FoodCategory } from '../types';

interface FoodItemFormProps {
  onSubmit: (item: FoodItem) => void;
}

export default function FoodItemForm({ onSubmit }: FoodItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    shelfLife: '',
    category: 'Dairy' as FoodCategory
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border-2 border-[#2d2d2d] bg-[#f3ede3] px-3 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full border-2 border-[#2d2d2d] bg-[#f3ede3] px-3 py-2"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Shelf Life (days)</label>
          <input
            type="number"
            value={formData.shelfLife}
            onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
            className="w-full border-2 border-[#2d2d2d] bg-[#f3ede3] px-3 py-2"
            required
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
          className="w-full border-2 border-[#2d2d2d] bg-[#f3ede3] px-3 py-2 appearance-none"
        >
          <option value="Dairy">Dairy</option>
          <option value="Meat">Meat</option>
          <option value="Produce">Produce</option>
          <option value="Bakery">Bakery</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full bg-[#2d2d2d] text-[#f3ede3] py-3 mt-4 hover:bg-[#1a1a1a] transition-colors flex items-center justify-center"
      >
        <span className="mr-2">+</span>
        Add Item
      </button>
    </form>
  );
}