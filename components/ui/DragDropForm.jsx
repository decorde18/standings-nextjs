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
  deleteItem,
  table,
  initialData = {},
  redirectPath,
  dlid,
}) => {
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setAvailableOptions(
      options.filter(
        (opt) =>
          !initialSelected.find((sel) => sel.category_id === opt.category_id),
      ),
    );
    setSelectedOptions(initialSelected);
    setMounted(true);
  }, [options, initialSelected]);

  const handleSelect = (option) => {
    setAvailableOptions((prev) =>
      prev.filter((opt) => opt.category_id !== option.category_id),
    );
    setSelectedOptions((prev) => [
      ...prev,
      { ...option, priority: prev.length },
    ]);
  };

  const handleRemove = (option) => {
    const removeItem = selectedOptions.find(
      (item) => item.name === option,
    ).category_id;

    setSelectedOptions((prev) =>
      prev.filter((opt) => opt.category_id !== removeItem),
    );
    setAvailableOptions((prev) => [
      ...prev,
      selectedOptions.find((opt) => opt.category_id === removeItem),
    ]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = selectedOptions.findIndex(
      (opt) => opt.category_id === active.id,
    );
    const overIndex = selectedOptions.findIndex(
      (opt) => opt.category_id === over.id,
    );

    const newOrder = arrayMove(selectedOptions, activeIndex, overIndex).map(
      (opt, index) => ({
        ...opt,
        priority: index,
      }),
    );

    setSelectedOptions(newOrder);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFormMessage(null);

    const toCreate = selectedOptions.filter((opt) => !opt.tiebreaker_id);
    const toUpdate = selectedOptions.filter((opt) => opt.tiebreaker_id);
    const toDelete = availableOptions.filter((opt) => opt.category_id);
    try {
      if (toUpdate.length > 0) {
        await Promise.all(
          toUpdate.map((opt) =>
            update({
              table,
              id: opt.tiebreaker_id,
              data: { priority: opt.priority },
            }),
          ),
        );
      }

      if (toCreate.length > 0) {
        await Promise.all(
          toCreate.map((opt) =>
            create({
              table,
              data: {
                category_id: opt.category_id,
                priority: opt.priority,
                division_id: dlid,
              },
            }),
          ),
        );
      }

      if (toDelete.length > 0) {
        await Promise.all(
          toDelete.map((opt) => deleteItem({ table, id: opt.tiebreaker_id })),
        );
      }

      setFormMessage('Changes saved successfully!');
      if (redirectPath) router.push(redirectPath);
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
            key={option.category_id}
            type="button"
            onClick={() => handleSelect(option)}
          >
            {option.name}
          </Button>
        ))}
      </div>

      <h2>Selected Options</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={selectedOptions.map((opt) => opt.category_id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.selectedContainer}>
            {selectedOptions.map((option) => (
              <SortableItem
                key={option.category_id}
                id={option.category_id}
                name={option.name}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Submit'}
      </Button>
      {formMessage && <p>{formMessage}</p>}
    </form>
  );
};

const SortableItem = ({ id, name, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.sortableItem}>
      <Button type="button" {...attributes} {...listeners}>
        ☰ <span>{name}</span>
      </Button>
      <Button type="button" onClick={() => onRemove(id)}>
        🗑️
      </Button>
    </div>
  );
};

export default DragDropForm;
