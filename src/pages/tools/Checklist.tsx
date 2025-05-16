
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface ChecklistCategory {
  id: string;
  title: string;
  timeframe: string;
  items: ChecklistItem[];
}

const Checklist: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>([
    {
      id: '12-months',
      title: '12+ Months Before',
      timeframe: '12+ Months',
      items: [
        { id: '1-1', title: 'Set a wedding budget', dueDate: '', completed: false },
        { id: '1-2', title: 'Create a guest list', dueDate: '', completed: false },
        { id: '1-3', title: 'Research and book your venue', dueDate: '', completed: false },
        { id: '1-4', title: 'Set a wedding date', dueDate: '', completed: false },
        { id: '1-5', title: 'Start researching vendors', dueDate: '', completed: false },
        { id: '1-6', title: 'Choose your wedding party', dueDate: '', completed: false },
      ]
    },
    {
      id: '8-10-months',
      title: '8-10 Months Before',
      timeframe: '8-10 Months',
      items: [
        { id: '2-1', title: 'Book your photographer and videographer', dueDate: '', completed: false },
        { id: '2-2', title: 'Book your caterer', dueDate: '', completed: false },
        { id: '2-3', title: 'Book your band or DJ', dueDate: '', completed: false },
        { id: '2-4', title: 'Shop for wedding attire', dueDate: '', completed: false },
        { id: '2-5', title: 'Create a wedding website', dueDate: '', completed: false },
        { id: '2-6', title: 'Arrange accommodations for out-of-town guests', dueDate: '', completed: false },
      ]
    },
    {
      id: '6-8-months',
      title: '6-8 Months Before',
      timeframe: '6-8 Months',
      items: [
        { id: '3-1', title: 'Order invitations and stationery', dueDate: '', completed: false },
        { id: '3-2', title: 'Book florist', dueDate: '', completed: false },
        { id: '3-3', title: 'Order wedding cake', dueDate: '', completed: false },
        { id: '3-4', title: 'Book honeymoon travel', dueDate: '', completed: false },
        { id: '3-5', title: 'Register for gifts', dueDate: '', completed: false },
        { id: '3-6', title: 'Book transportation', dueDate: '', completed: false },
      ]
    },
    {
      id: '3-6-months',
      title: '3-6 Months Before',
      timeframe: '3-6 Months',
      items: [
        { id: '4-1', title: 'Send out invitations', dueDate: '', completed: false },
        { id: '4-2', title: 'Plan ceremony details', dueDate: '', completed: false },
        { id: '4-3', title: 'Purchase wedding bands', dueDate: '', completed: false },
        { id: '4-4', title: 'Book rehearsal dinner venue', dueDate: '', completed: false },
        { id: '4-5', title: 'Confirm menu with caterer', dueDate: '', completed: false },
        { id: '4-6', title: 'Plan reception details', dueDate: '', completed: false },
      ]
    },
    {
      id: '1-3-months',
      title: '1-3 Months Before',
      timeframe: '1-3 Months',
      items: [
        { id: '5-1', title: 'Obtain marriage license', dueDate: '', completed: false },
        { id: '5-2', title: 'Track RSVPs', dueDate: '', completed: false },
        { id: '5-3', title: 'Create seating chart', dueDate: '', completed: false },
        { id: '5-4', title: 'Final dress fitting', dueDate: '', completed: false },
        { id: '5-5', title: 'Prepare vows', dueDate: '', completed: false },
        { id: '5-6', title: 'Confirm details with all vendors', dueDate: '', completed: false },
      ]
    },
    {
      id: '1-week',
      title: '1 Week Before',
      timeframe: '1 Week',
      items: [
        { id: '6-1', title: 'Final venue walkthrough', dueDate: '', completed: false },
        { id: '6-2', title: 'Confirm final headcount with caterer', dueDate: '', completed: false },
        { id: '6-3', title: 'Pack for honeymoon', dueDate: '', completed: false },
        { id: '6-4', title: 'Prepare payment envelopes for vendors', dueDate: '', completed: false },
        { id: '6-5', title: 'Prepare wedding day emergency kit', dueDate: '', completed: false },
      ]
    },
  ]);
  
  const toggleItemCompletion = (categoryId: string, itemId: string) => {
    setChecklist(current => 
      current.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                const newState = !item.completed;
                if (newState) {
                  toast.success(`Task completed: ${item.title}`);
                }
                return { ...item, completed: newState };
              }
              return item;
            })
          };
        }
        return category;
      })
    );
  };
  
  const getTotalCompletedPercentage = () => {
    let totalItems = 0;
    let completedItems = 0;
    
    checklist.forEach(category => {
      totalItems += category.items.length;
      completedItems += category.items.filter(item => item.completed).length;
    });
    
    return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  };
  
  const getCategoryCompletedPercentage = (category: ChecklistCategory) => {
    if (category.items.length === 0) return 0;
    const completedItems = category.items.filter(item => item.completed).length;
    return Math.round((completedItems / category.items.length) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container-custom max-w-5xl">
          <div className="mb-8">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              Wedding Checklist
            </h1>
            <p className="text-gray-600">
              Keep track of all your wedding planning tasks with our comprehensive checklist.
            </p>
          </div>
          
          {/* Overall Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex justify-between items-end mb-2">
              <h2 className="font-semibold text-lg">Overall Progress</h2>
              <span className="text-space font-medium">{getTotalCompletedPercentage()}% Complete</span>
            </div>
            <Progress value={getTotalCompletedPercentage()} className="h-3" />
          </div>
          
          {/* Checklist Categories */}
          <Accordion type="multiple" defaultValue={['12-months']} className="mb-8 space-y-4">
            {checklist.map(category => (
              <AccordionItem key={category.id} value={category.id} className="border rounded-lg shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                    <div>
                      <h3 className="font-playfair font-semibold text-lg text-left">{category.title}</h3>
                      <p className="text-gray-500 text-sm">{category.timeframe}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <Progress value={getCategoryCompletedPercentage(category)} className="w-24 h-2" />
                      <span className="text-space font-medium text-sm">{getCategoryCompletedPercentage(category)}%</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    {category.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <Checkbox 
                          id={item.id} 
                          checked={item.completed}
                          onCheckedChange={() => toggleItemCompletion(category.id, item.id)}
                          className="h-5 w-5"
                        />
                        <label 
                          htmlFor={item.id} 
                          className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                        >
                          {item.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center">
            <Button className="bg-wed hover:bg-wed/90">
              Export Checklist
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checklist;
