import { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { checklistService } from '../../services/checklistService';

const SecurityChecklist = ({ onSelectionChange, selectedItems = [] }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState(new Map());

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Initialize selected items map from props
    const itemsMap = new Map();
    selectedItems.forEach(item => {
      itemsMap.set(item._id, { ...item, selected: true });
    });
    setSelectedItemsMap(itemsMap);
  }, [selectedItems]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchItems();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await checklistService.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setActiveCategory(response.data.categories[0]._id);
        }
      }
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };


  const searchItems = async () => {
    try {
      const response = await checklistService.searchItems(searchQuery);
      if (response.success) {
        setSearchResults(response.data.items);
      }
    } catch (err) {
      console.error('Error searching items:', err);
    }
  };

  const toggleItemSelection = (item) => {
    const newMap = new Map(selectedItemsMap);
    const isSelected = newMap.has(item._id);
    
    if (isSelected) {
      newMap.delete(item._id);
    } else {
      newMap.set(item._id, { ...item, selected: true });
    }
    
    setSelectedItemsMap(newMap);
    
    // Convert map to array and notify parent
    const selectedArray = Array.from(newMap.values());
    onSelectionChange?.(selectedArray);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const ItemCard = ({ item, isSelected = false, onToggle }) => (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => onToggle(item)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
            {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
          
          {(item.minValue && item.maxValue) && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Value Range: </span>
              {item.minValue === 'NA' ? 'N/A' : `${formatCurrency(item.minValue)} - ${formatCurrency(item.maxValue)}`}
            </div>
          )}
          
          {item.riskLevel && (
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className={`w-4 h-4 ${
                item.riskLevel === 'high' ? 'text-red-500' : 
                item.riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <span className={`text-sm capitalize ${
                item.riskLevel === 'high' ? 'text-red-600 dark:text-red-400' : 
                item.riskLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-green-600 dark:text-green-400'
              }`}>
                {item.riskLevel} Risk
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CategorySection = ({ category }) => {
    const [categoryItems, setCategoryItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (category._id === activeCategory) {
        loadCategoryItems();
      }
    }, [category._id, activeCategory]);

    const loadCategoryItems = async () => {
      try {
        setLoading(true);
        const response = await checklistService.getCategoryItems(category._id);
        if (response.success) {
          setCategoryItems(response.data.items);
        }
      } catch (err) {
        console.error('Error loading category items:', err);
      } finally {
        setLoading(false);
      }
    };

    if (category._id !== activeCategory) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{category.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-3">
            {categoryItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isSelected={selectedItemsMap.has(item._id)}
                onToggle={toggleItemSelection}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading security checklist...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={loadCategories}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Checklist</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Select valuable items you'll be carrying in your luggage
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Selected Items</div>
          <div className="text-2xl font-bold text-blue-600">{selectedItemsMap.size}</div>
        </div>
      </div>

      {/* Category Tabs - Moved to top */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setActiveCategory(category._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category._id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Search Toggle */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showSearch 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Search className="w-4 h-4" />
          Search Items
        </button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for items (e.g., laptop, jewelry, documents...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Search Results</h4>
              <div className="grid gap-2">
                {searchResults.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    isSelected={selectedItemsMap.has(item._id)}
                    onToggle={toggleItemSelection}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Category Items */}
      {!showSearch && activeCategory && (
        <CategorySection category={categories.find(cat => cat._id === activeCategory)} />
      )}

      {/* Selected Items Summary */}
      {selectedItemsMap.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Selected Items ({selectedItemsMap.size})
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedItemsMap.values()).map((item) => (
              <span
                key={item._id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {item.name}
                <button
                  onClick={() => toggleItemSelection(item)}
                  className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityChecklist;
