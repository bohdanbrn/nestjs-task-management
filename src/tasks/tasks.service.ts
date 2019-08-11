import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
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

        if (task) {
            task.status = status;

            return task;
        }

        return null;
    }

    deleteTask(id: string): boolean {
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
