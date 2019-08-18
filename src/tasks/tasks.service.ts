import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterData: GetTasksFilterDto): Task[] {
        const { status, search } = filterData;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(
                task => task.title.includes(search) ||
                task.description.includes(search),
            );
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);

        if (!task) {
            throw new NotFoundException();
        }
        task.status = status;

        return task;
    }

    deleteTask(id: string): boolean {
        // TODO (rewrite)
        const taskIndex = this.getTaskIndex(id);

        if (taskIndex >= 0) {
            this.tasks.splice(taskIndex, 1);

            return true;
        }

        return false;
    }

    private getTaskIndex(id: string): number {
        for (const i in this.tasks) {
            if (this.tasks[i].id === id) {
                return +i;
            }
        }
        return -1;
    }
}
