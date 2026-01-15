
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import type { HierarchyUser } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserTable } from "./user-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "./create-user-dialog";
import { TableSkeleton } from "./table-skeleton";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const flattenUsers = (users: HierarchyUser[], level = 0, parentExpanded = true): HierarchyUser[] => {
  let result: HierarchyUser[] = [];
  users.forEach(user => {
    if (parentExpanded) {
      result.push({ ...user, level });
      if (user.children && user.children.length > 0 && user.isExpanded) {
        result = result.concat(flattenUsers(user.children, level + 1, true));
      }
    }
  });
  return result;
};


export function UserDashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [usersHierarchy, setUsersHierarchy] = useState<HierarchyUser[]>([]);
  
  const { accessToken } = useAuthStore();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/users-hierarchy`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      
      const addExpansionState = (users: any[]): HierarchyUser[] => {
          return users.map(u => ({...u, isExpanded: false, children: addExpansionState(u.children || [])}))
      }

      // API response is an object with children, so we use its children array
      setUsersHierarchy(addExpansionState(data.children || []));

    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de los usuarios.',
        variant: 'destructive'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const toggleExpand = (userId: string) => {
    const toggle = (users: HierarchyUser[]): HierarchyUser[] => {
      return users.map(u => {
        if (u.id === userId) {
          return {...u, isExpanded: !u.isExpanded};
        }
        if (u.children && u.children.length > 0) {
          return {...u, children: toggle(u.children)};
        }
        return u;
      });
    }
    setUsersHierarchy(toggle(usersHierarchy));
  }


  const filteredUsers = useMemo(() => {
    const flatList = flattenUsers(usersHierarchy);
    if (!search) {
      return flatList;
    }
    
    const lowercasedSearch = search.toLowerCase();
    
    // We need to find matching users and all their parents to display the hierarchy correctly
    const searchInHierarchy = (users: HierarchyUser[]): HierarchyUser[] => {
        let results: HierarchyUser[] = [];
        for (const user of users) {
            const isMatch = user.name.toLowerCase().includes(lowercasedSearch) || user.id.toLowerCase().includes(lowercasedSearch);
            const matchingChildren = searchInHierarchy(user.children);

            if (isMatch || matchingChildren.length > 0) {
                results.push({
                    ...user,
                    children: matchingChildren,
                    isExpanded: search ? true : user.isExpanded // Auto-expand on search
                });
            }
        }
        return results;
    };
    
    const hierarchy = searchInHierarchy(usersHierarchy);
    return flattenUsers(hierarchy);

  }, [search, usersHierarchy]);

  return (
    <>
      <CreateUserDialog isOpen={isUserDialogOpen} onClose={() => setUserDialogOpen(false)} />
      <Card>
        <CardHeader className="space-y-4">
             <div className="space-y-1">
                <CardTitle>{t('dashboard.title')}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    type="search"
                    placeholder={t('dashboard.searchPlaceholder')}
                    className="pl-8 w-full max-w-sm bg-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <TableSkeleton columns={10} rows={10} />
          ) : (
            <UserTable 
              users={filteredUsers}
              toggleExpand={toggleExpand}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
