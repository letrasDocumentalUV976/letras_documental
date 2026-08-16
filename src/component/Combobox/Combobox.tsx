"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface ComboboxOption {
  id: string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

const Combobox = ({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage = "Sin resultados",
  disabled,
}: ComboboxProps) => {
  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value]
  );

  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setQuery(selected?.label ?? "");
  }, [selected, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || query === selected?.label) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        option.description?.toLowerCase().includes(q)
    );
  }, [options, query, selected]);

  useEffect(() => {
    setHighlighted(0);
  }, [filtered.length]);

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.id);
    setQuery(option.label);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    if (value) onChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[highlighted];
      if (option) handleSelect(option);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery(selected?.label ?? "");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      />
      {open && !disabled && (
        <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((option, index) => (
              <li
                key={option.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
                onMouseEnter={() => setHighlighted(index)}
                className={`cursor-pointer px-3 py-2 ${
                  index === highlighted ? "bg-primary/10" : ""
                }`}
              >
                <p className="truncate text-sm font-medium text-gray-800">
                  {option.label}
                </p>
                {option.description && (
                  <p className="truncate text-xs text-gray-500">
                    {option.description}
                  </p>
                )}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">{emptyMessage}</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Combobox;
