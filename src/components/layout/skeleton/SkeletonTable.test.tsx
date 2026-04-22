import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonTable } from './SkeletonTable';

describe('SkeletonTable (with real Skeleton component)', () => {
  it('renders skeleton placeholders with correct structure', () => {
    render(<SkeletonTable columnsLength={3} pageSize={2} />);

    // Check container div
    const container = document.querySelector('.flex.w-full.flex-col.gap-2');
    expect(container).toBeInTheDocument();

    // Check rows
    const rows = document.querySelectorAll('.flex.gap-4');
    expect(rows).toHaveLength(2);

    // Each row should have 3 skeleton elements
    rows.forEach((row) => {
      const skeletons = row.querySelectorAll('.h-6.flex-1');
      expect(skeletons).toHaveLength(3);
    });
  });
});
