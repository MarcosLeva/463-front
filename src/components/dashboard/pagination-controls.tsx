
"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  return (
    <div className="flex w-full items-center justify-end space-x-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        {t('pagination.previous')}
      </Button>
      <span className="text-sm text-muted-foreground">
        {t('pagination.pageOf', { currentPage, totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onPageChange(Math.min(currentPage + 1, totalPages))
        }
        disabled={currentPage === totalPages}
      >
        {t('pagination.next')}
      </Button>
    </div>
  );
}
