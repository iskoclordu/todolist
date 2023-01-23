# todolist
ToDoList scheduler

Basic ToDoList Aplication.

This project is an assignment for The Odin Project.

Activities can be added, deleted, or edited.

Users can display activities filtered for three different time periods- today, this week, and all. Also, activities belonging to a project are an option to display.

There is a sample-data button to add sample data. 

Activities must have a title and date and importance at least. Descriptions, notes, and projects are other options for users to use in case of need.

The application has also a display part for the performance index. In that part, users can track their performance for filtered activities. The performance index is calculated for displaying activities at that moment. So the current filter is also for the performance index.

A performance index is a number between 0 and 1. 1 is the maximum value of this index. It shows that you have completed all activities that are on the screen. So 0 is the minimum value which means you should remember that well-known saying of Marcus Aurelius: "Begin - to begin is half the work."

The application calculates two different performance indexes and shows. One of them is PI which stands for a simple performance index. PI is the ratio of the number of completed activities and all activities. The other one is IPI, which represents the performance index calculated with respect to the importance of the activities.