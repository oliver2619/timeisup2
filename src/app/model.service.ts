import { Injectable } from '@angular/core';
import { AggregatedRecordings } from '../model/aggregated-recordings';
import { Model } from "../model/model";
import { ReadonlyDay } from '../model/readonly-day';
import { ReadonlyRecord } from '../model/readonly-record';
import { ToastService } from "./toast.service";
import { Task } from "../model/task";
import { DayOfWeek } from "../model/dayofweek";

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private static readonly LOCAL_STORAGE_KEY = 'timeisup2:';

  private readonly model: Model;

  get activeDay(): ReadonlyDay {
    return this.model.activeDay;
  }

  get activeDayAggregatedRecordings(): AggregatedRecordings {
    return this.model.activeDayAggregatedRecordings;
  }

  get activeDayRecords(): ReadonlyRecord[] {
    return this.model.activeDayRecords;
  }

  get activeRecord(): ReadonlyRecord | undefined {
    return this.model.activeRecord;
  }

  get comment(): string {
    return this.model.comment;
  }

  set comment(comment: string) {
    this.model.comment = comment;
    this.save();
  }

  get favoriteProject(): string | undefined {
    return this.model.favoriteProject;
  }

  set favoriteProject(name: string | undefined) {
    this.model.favoriteProject = name;
    this.save();
  }

  get hoursPerDay(): number {
    return this.model.hoursPerDay;
  }

  get hoursPerWeek(): number {
    return this.model.hoursPerWeek;
  }

  set hoursPerWeek(v: number) {
    this.model.hoursPerWeek = v;
    this.save();
  }

  get isRecording(): boolean {
    return this.model.isRecording;
  }

  get maxHoursPerDay(): number {
    return this.model.maxHoursPerDay;
  }

  set maxHoursPerDay(v: number) {
    this.model.maxHoursPerDay = v;
    this.save();
  }

  get pensum(): number {
    return this.model.pensum;
  }

  set pensum(p: number) {
    this.model.pensum = p;
    this.save();
  }

  get projects(): string[] {
    return this.model.projects;
  }

  get recorededYears(): number[] {
    return this.model.recordedYears;
  }

  constructor(private toastService: ToastService) {
    const json = localStorage.getItem(ModelService.LOCAL_STORAGE_KEY);
    if (json == null) {
      this.model = Model.newInstance();
    } else {
      this.model = Model.load(JSON.parse(json));
    }
  }

  addProject(name: string) {
    this.model.addProject(name);
    this.save();
  }

  addTask(project: string, task: string) {
    this.model.addTask(project, task);
    this.save();
  }

  canJoinDayRecordWithPrevious(year: number, month: number, day: number, index: number): boolean {
    return this.model.canJoinDayRecordWithPrevious(year, month, day, index);
  }

  canUseProjectAsFavorite(project: string): boolean {
    return this.model.canUseProjectAsFavorite(project);
  }

  canUseTaskAsFavorite(project: string, task: string): boolean {
    return this.model.canUseTaskAsFavorite(project, task);
  }

  getDayAggregatedRecordings(year: number, month: number, day: number): AggregatedRecordings | undefined {
    return this.model.getDayAggregatedRecordings(year, month, day);
  }

  getDayComment(year: number, month: number, day: number): string {
    return this.model.getDayComment(year, month, day);
  }

  getDayHoliday(year: number, month: number, day: number): number {
    return this.model.getDayHoliday(year, month, day);
  }

  getDayRecords(year: number, month: number, day: number): ReadonlyRecord[] {
    return this.model.getDayRecords(year, month, day);
  }

  getFavoriteTask(project: string): string | undefined {
    return this.model.getFavoriteTask(project);
  }

  getOverhours(): number {
    return this.model.getOverhours();
  }

  getOverhoursOfMonth(year: number, month: number): number {
    return this.model.getOverhoursOfMonth(year, month);
  }

  getRecordedDays(year: number, month: number): number[] {
    return this.model.getRecordedDays(year, month);
  }

  getRecordedMonths(year: number): number[] {
    return this.model.getRecordedMonths(year);
  }

  getTasksForProject(project: string): string[] {
    return this.model.getTasksForProject(project);
  }

  getUnrecordedDays(year: number, month: number): number[] {
    return this.model.getUnrecordedDays(year, month);
  }

  getUsableProjects(): string[] {
    return this.model.getUsableProjects();
  }

  getUsableTasksForProject(project: string): string[] {
    return this.model.getUsableTasksForProject(project);
  }

  getWorkedHours(year: number, month: number, day: number): number {
    return this.model.getWorkedHours(year, month, day);
  }

  hasProject(name: string): boolean {
    return this.model.hasProject(name);
  }

  hasRecordings(year: number, month: number, day: number): boolean {
    return this.model.hasRecordings(year, month, day);
  }

  hasTask(project: string, task: string): boolean {
    return this.model.hasTask(project, task);
  }

  isDayComplete(year: number, month: number, day: number): boolean {
    return this.model.isDayComplete(year, month, day);
  }

  isDayOfWeekActive(day: DayOfWeek): boolean {
    return this.model.isDayOfWeekActive(day);
  }

  isProjectActive(name: string): boolean {
    return this.model.isProjectActive(name);
  }

  isProjectInUse(name: string): boolean {
    return this.model.isProjectInUse(name);
  }

  isTaskActive(project: string, task: string): boolean {
    return this.model.isTaskActive(project, task);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this.model.isTaskInUse(project, task);
  }

  joinDayRecordWithPrevious(year: number, month: number, day: number, index: number) {
    this.model.joinDayRecordWithPrevious(year, month, day, index);
    this.save();
  }

  removeDayRecord(year: number, month: number, day: number, index: number) {
    this.model.removeDayRecord(year, month, day, index);
    this.save();
  }

  removeDayRecords(year: number, month: number, day: number) {
    this.model.removeDayRecords(year, month, day);
    this.save();
  }

  removeMonthRecords(year: number, month: number, keepOvertime: boolean) {
    this.model.removeMonthRecords(year, month, keepOvertime);
    this.save();
  }

  removeProject(name: string) {
    this.model.removeProject(name);
    this.save();
  }

  removeTask(project: string, task: string) {
    this.model.removeTask(project, task);
    this.save();
  }

  renameProject(oldName: string, newName: string) {
    this.model.renameProject(oldName, newName);
    this.save();
  }

  renameTask(project: string, oldName: string, newName: string) {
    this.model.renameTask(project, oldName, newName);
    this.save();
  }

  setDayComment(year: number, month: number, day: number, comment: string) {
    this.model.setDayComment(year, month, day, comment);
    this.save();
  }

  setDayHoliday(year: number, month: number, day: number, holiday: number) {
    this.model.setDayHoliday(year, month, day, holiday);
    this.save();
  }

  setDayOfWeekActive(day: DayOfWeek, active: boolean) {
    this.model.setDayOfWeekActive(day, active);
    this.save();
  }

  setDayRecord(year: number, month: number, day: number, index: number, start: Date, end: Date | undefined, project: string, task: string) {
    this.model.setDayRecord(year, month, day, index, start, end, project, task);
    this.save();
  }

  setFavoriteTask(project: string, task: string) {
    this.model.setFavoriteTask(project, task);
    this.save();
  }

  setOverhours(hours: number) {
    this.model.setOverhours(hours);
    this.save();
  }
  
  setProjectActive(project: string, active: boolean) {
    this.model.setProjectActive(project, active);
    this.save();
  }

  setTaskActive(project: string, task: string, active: boolean) {
    this.model.setTaskActive(project, task, active);
    this.save();
  }

  splitDayRecord(year: number, month: number, day: number, index: number) {
    this.model.splitDayRecord(year, month, day, index);
    this.save();
  }

  startTask(project: string, task: string) {
    this.model.startTask(project, task, t => this.onStopTask(t));
    this.toastService.info(`Started task ${task} for project ${project}`);
    this.save();
  }

  stop() {
    this.model.stop(task => this.onStopTask(task));
    this.save();
  }

  private save() {
    localStorage.setItem(ModelService.LOCAL_STORAGE_KEY, JSON.stringify(this.model.save()));
  }

  private onStopTask(task: Task) {
    this.toastService.info(`Stopped task ${task.name} for project ${task.project.name}.`);
  }
}
