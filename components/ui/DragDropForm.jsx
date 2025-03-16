'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '@/styles/components/DragDropForm.module.css';
import Button from './Button';

const DragDropForm = ({
  options,
  initialSelected,
  create,
  update,
  table,
  initialData = {},
  redirectPath,
}) => {
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setAvailableOptions(
      options.filter((opt) => !initialSelected.find((sel) => sel.id === opt.id))
    );
    setSelectedOptions(initialSelected);
    setMounted(true);
  }, [options, initialSelected]);

  const handleSelect = (option) => {
    setAvailableOptions((prev) => prev.filter((opt) => opt.id !== option.id));
    setSelectedOptions((prev) => [...prev, option]);
  };

  const handleRemove = (option) => {
    setSelectedOptions((prev) => prev.filter((opt) => opt.id !== option.id));
    setAvailableOptions((prev) => [...prev, option]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = selectedOptions.findIndex(
      (opt) => opt.id === active.id
    );
    const overIndex = selectedOptions.findIndex((opt) => opt.id === over.id);

    setSelectedOptions((prev) => arrayMove(prev, activeIndex, overIndex));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFormMessage(null);

    const selectedIds = selectedOptions.map((opt) => opt.id);

    try {
      if (Object.keys(initialData).length > 0) {
        await update({ table, id: initialData.id, data: { selectedIds } });
        console.log(`${table} updated successfully!`);
        setFormMessage('Data updated successfully!');
      } else {
        await create({ table, data: { selectedIds } });
        console.log(`${table} created successfully!`);
        setFormMessage('Data created successfully!');
      }

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push(`/${table}`);
      }
    } catch (error) {
      console.error('Data operation error:', error);
      setFormMessage('Error saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Available Options</h2>
      <div className={styles.optionsContainer}>
        {availableOptions.map((option) => (
          <Button
            key={option.id}
            type="button"
            // className={styles.optionButton}
            onClick={() => handleSelect(option)}
          >
            {option.name}
          </Button>
        ))}
      </div>

      <h2>Selected Options</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={selectedOptions.map((opt) => opt.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.selectedContainer}>
            {selectedOptions.map((option) => (
              <SortableItem
                key={option.id}
                id={option.id}
                name={option.name}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="submit"
        // className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Submit'}
      </Button>
      {formMessage && <p>{formMessage}</p>}
    </form>
  );
};

const SortableItem = ({ id, name, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  // Style for drag transformation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.sortableItem}>
      <Button
        type="button"
        {...attributes} // Apply drag attributes to the button
        {...listeners} // Apply drag listeners to the button
        // className={styles.sortableButton}
      >
        ☰ <span>{name}</span>
      </Button>
      <Button
        type="button"
        onClick={() => onRemove({ id, name })}
        // className={styles.removeButton}
      >
        🗑️
      </Button>
    </div>
  );
};

export default DragDropForm;
