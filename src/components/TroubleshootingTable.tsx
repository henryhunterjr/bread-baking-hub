import React, { useMemo, useRef, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import symptomsData from '@/data/symptoms.json';

const TroubleshootingTable: React.FC = () => {
  const { 
    symptoms, 
    filters, 
    loadSymptoms, 
    setSearchTerm, 
    setCategory 
  } = useStore();

  // Load symptoms on mount
  useEffect(() => {
    if (symptoms.length === 0) {
      loadSymptoms(symptomsData.symptoms);
    }
  }, [symptoms.length, loadSymptoms]);

  // Get unique categories for the dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(symptoms.map(s => s.category))];
    return ['', ...uniqueCategories]; // Include empty string for "All Categories"
  }, [symptoms]);

  // Filter symptoms based on search term and category
  const filteredSymptoms = useMemo(() => {
    return symptoms.filter(symptom => {
      const matchesSearch = !filters.searchTerm || 
        symptom.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        symptom.labels.some(label => 
          label.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      
      const matchesCategory = !filters.category || symptom.category === filters.category;
      
      return matchesSearch && matchesCategory;
    });
  }, [symptoms, filters.searchTerm, filters.category]);

  // Virtualization setup
  const parentRef = useRef<HTMLDivElement>(null);
  const shouldVirtualize = filteredSymptoms.length > 20;
  
  const virtualizer = useVirtualizer({
    count: filteredSymptoms.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    enabled: shouldVirtualize,
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold text-primary">Bread Troubleshooting Guide</h2>
        
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              Search symptoms
            </label>
            <input
              id="search"
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or labels..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
          </div>
          
          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium mb-2">
              Filter by category
            </label>
            <Listbox value={filters.category} onChange={setCategory}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-input bg-background py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all">
                  <span className="block truncate">
                    {filters.category || 'All Categories'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background border border-input py-1 shadow-lg focus:outline-none">
                    {categories.map((category) => (
                      <Listbox.Option
                        key={category}
                        value={category}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-yellow-500/20' : ''
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {category || 'All Categories'}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredSymptoms.length} of {symptoms.length} symptoms
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-4 border-b border-border">
          <div className="grid grid-cols-4 gap-4 font-semibold text-foreground">
            <div>ID</div>
            <div>Category</div>
            <div className="col-span-2">Labels</div>
          </div>
        </div>
        
        {shouldVirtualize ? (
          <div
            ref={parentRef}
            className="h-96 overflow-auto"
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const symptom = filteredSymptoms[virtualItem.index];
                return (
                  <div
                    key={symptom.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="px-4 py-4 border-b border-border last:border-b-0 bg-gray-50 dark:bg-gray-800 hover:bg-yellow-500/10 transition-colors focus:ring-2 focus:ring-yellow-400"
                  >
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="font-mono text-sm text-primary font-medium">{symptom.id}</div>
                  <div className="capitalize">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-medium">
                      {symptom.category}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {symptom.labels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-500/20 transition-colors focus:ring-2 focus:ring-yellow-400"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {filteredSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="px-4 py-4 border-b border-border last:border-b-0 bg-gray-50 dark:bg-gray-800 hover:bg-yellow-500/10 transition-colors focus:ring-2 focus:ring-yellow-400"
              >
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="font-mono text-sm text-primary font-medium">{symptom.id}</div>
                  <div className="capitalize">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-medium">
                      {symptom.category}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {symptom.labels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-500/20 transition-colors focus:ring-2 focus:ring-yellow-400"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredSymptoms.length === 0 && (
          <div className="px-4 py-12 text-center text-muted-foreground bg-gray-50 dark:bg-gray-800">
            <div className="text-lg font-medium mb-2">No symptoms found</div>
            <p className="text-sm">Try adjusting your search criteria or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TroubleshootingTable;