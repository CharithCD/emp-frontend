"use client";
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


interface Subject {
  _id: string;
  name: string;
}

export default function Page() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);


  useEffect(() => {
    if (hasFetched) return;

    const fetchData = async () => {
      try {
        // const response = await axios.get(`/api/subjects`);
        // const subjects = response.data.data;
        setSubjects(subjects);
        setHasFetched(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching subject data",
          description: "Could not fetch subjects data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Leaves</h1>
        <Button asChild variant='link'>
          <Link href={'/dashboard/leaves/request'}>Request a Leave</Link>
        </Button>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <div className='p-8 w-full'>
          {loading && (<Loader2 className='animate-spin' />)}
          {
            subjects.length === 0 ? (
              <p>create a subject first</p>
            ) :
              <div className="grid gap-8 sm:grid-cols-1 md:mt-0 lg:grid-cols-3">
                {
                  subjects.map((subject: Subject) => (
                    <Card key={subject._id} className='p-8 hover:border-primary hover:bg-secondary'>
                      <CardTitle>
                        <Link href={`/dashboard/subject/${subject._id}`}>
                          {subject.name}
                        </Link>
                      </CardTitle>
                    </Card>
                  ))
                }
              </div>
          }
        </div>
      </div>
    </main>
  );
}