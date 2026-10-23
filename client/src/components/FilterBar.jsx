import React from 'react';
import { Search, X, SlidersHorizontal, Clock, ArrowUpDown, Filter } from 'lucide-react';

const FilterBar = ({
  categories = [],
  selectedCategories = [],
  onCategoryToggle,
  searchQuery,
  onSearchChange,
  openNowOnly,
  onOpenNowToggle,
  sortBy,
  onSortChange,
  onClearFilters,
  totalResults = 0
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategories.length > 0 ||
    openNowOnly ||
    sortBy !== 'nearest';

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginBottom: '2rem'
    }}>
      {/* Top Search & Sort Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1.25rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
          <input
            id="search-places-input"
            aria-label="Search Kurunegala places by name, category, or keyword"
            type="text"
            placeholder="Search Kurunegala places (e.g. Athugala, Lake, Silver Temple)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-control"
            style={{
              paddingLeft: '2.75rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              height: '46px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '0.25rem'
              }}
              title="Clear search"
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort and Open Now Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Open Now Toggle */}
          <button
            type="button"
            onClick={onOpenNowToggle}
            className={`btn btn-sm ${openNowOnly ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              height: '46px',
              padding: '0 1rem',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: openNowOnly ? '1px solid #0d9488' : '1px solid #cbd5e1',
              backgroundColor: openNowOnly ? '#0d9488' : '#ffffff',
              color: openNowOnly ? '#ffffff' : '#334155'
            }}
            title="Show only places that are currently open in Sri Lanka"
          >
            <Clock size={16} />
            <span>Open Now</span>
            {openNowOnly && (
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
            )}
          </button>

          {/* Sort By Dropdown */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '180px' }}>
            <div style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <ArrowUpDown size={15} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-control"
              style={{
                height: '46px',
                paddingLeft: '2.25rem',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#334155'
              }}
              aria-label="Sort places"
            >
              <option value="nearest">Nearest first (Reference Point)</option>
              <option value="rating">Highest Rated</option>
              <option value="farthest">Farthest first</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Clear Filters Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid #f1f5f9'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <button
                key={cat._id || cat.name}
                type="button"
                onClick={() => onCategoryToggle(cat.name)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? '700' : '600',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid #0d9488` : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#ccfbf1' : '#ffffff',
                  color: isSelected ? '#0f766e' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{cat.name}</span>
                {cat.placeCount !== undefined && (
                  <span style={{
                    fontSize: '0.725rem',
                    backgroundColor: isSelected ? '#0d9488' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    padding: '0.05rem 0.4rem',
                    borderRadius: '9999px',
                    fontWeight: '700'
                  }}>
                    {cat.placeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Clear Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>
            Showing <strong>{totalResults}</strong> place{totalResults === 1 ? '' : 's'}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.825rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <X size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
