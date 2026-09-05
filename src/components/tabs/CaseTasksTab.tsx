import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Bell, 
  UserCheck,
  Flag
} from 'lucide-react';
import { Matter, TaskItem, AppLanguage, TimelineEvent } from '../../types';

interface CaseTasksTabProps {
  matter: Matter;
  tasks: TaskItem[];
  lang: AppLanguage;
  onAddTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
}

export const CaseTasksTab: React.FC<CaseTasksTabProps> = ({
  matter,
  tasks,
  lang,
  onAddTask,
  onToggleTaskStatus,
  onAddTimelineEvent
}) => {
  const isHi = lang === 'hi';
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskItem['type']>('Hearing');
  const [dueDate, setDueDate] = useState('2026-09-10');
  const [time, setTime] = useState('10:30 AM');
  const [priority, setPriority] = useState<TaskItem['priority']>('High');
  const [assignedTo, setAssignedTo] = useState('Adv. Anita Deshmukh');
  const [notes, setNotes] = useState('');

  const matterTasks = tasks.filter(t => t.matterId === matter.id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      matterId: matter.id,
      title,
      type,
      dueDate,
      time,
      priority,
      status: 'Pending',
      assignedTo,
      notes: notes || undefined,
      reminderSent: false
    };

    onAddTask(newTask);

    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? `नया कार्य दर्ज: ${title}` : `Task Created: ${title}`,
      titleHi: `नया कार्य दर्ज: ${title}`,
      description: isHi
        ? `${assignedTo} को नियत तिथि ${dueDate} (${time}) के लिए कार्य सौंपा गया।`
        : `Deadline set for ${dueDate} at ${time}. Assigned to ${assignedTo}.`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'TASK_DUE',
      badge: priority
    });

    setTitle('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleSendReminderAlert = (task: TaskItem) => {
    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? `कार्य स्मरण पत्र भेजा गया: ${task.title}` : `Reminder Dispatched: ${task.title}`,
      titleHi: `कार्य स्मरण पत्र भेजा गया: ${task.title}`,
      description: isHi
        ? `व्हाट्सएप एवं एसएमएस द्वारा ${task.assignedTo} को स्मरण पत्र प्रेषित किया गया। नियत: ${task.dueDate}`
        : `WhatsApp & SMS reminder alert sent to ${task.assignedTo} for ${task.dueDate}.`,
      actor: 'NyaySetu Bot',
      actorRole: 'System',
      type: 'WHATSAPP_SENT',
      badge: 'Reminder Sent'
    });

    alert(isHi ? `व्हाट्सएप व एसएमएस स्मरण पत्र ${task.assignedTo} को सफलतापूर्वक भेजा गया!` : `WhatsApp & SMS reminder successfully dispatched to ${task.assignedTo}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'केस से जुड़े कार्य, कोर्ट तारीखें व समय-सीमाएं' : 'Case-Linked Tasks, Hearings & Deadlines'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'कोई तारीख न छूटे: स्वचालित अलर्ट और सीधे कैलेंडर प्रविष्टि' : 'Never miss a court date or statutory limitation deadline'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? (isHi ? 'फॉर्म बंद करें' : 'Close Form') : (isHi ? '+ नया कार्य / तारीख जोड़ें' : '+ Add Task / Hearing')}</span>
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            {isHi ? 'नई तारीख या कार्य विवरण दर्ज करें' : 'Create New Docketing Task / Deadline'}
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHi ? 'कार्य का शीर्षक' : 'Task Title / Hearing Purpose'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. File Affidavit of Evidence / Attend Court Room 3"
              className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isHi ? 'प्रकार' : 'Type'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskItem['type'])}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Hearing">Court Hearing</option>
                <option value="Filing Deadline">Filing Deadline</option>
                <option value="Limitation Period">Limitation Period</option>
                <option value="Client Follow-up">Client Follow-up</option>
                <option value="Evidence Collection">Evidence Collection</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isHi ? 'नियत तिथि' : 'Due Date'}
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isHi ? 'समय' : 'Time'}
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isHi ? 'प्राथमिकता' : 'Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskItem['priority'])}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="High">High (Court / Limitation)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isHi ? 'जिम्मेदार व्यक्ति' : 'Assigned To'}
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Adv. Anita Deshmukh">Adv. Anita Deshmukh (Lead Litigator)</option>
                <option value="Rahul Verma">Rahul Verma (Paralegal / Associate)</option>
                <option value="NyaySetu Bot">NyaySetu Automated Bot</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isHi ? 'अतिरिक्त टिप्पणी' : 'Notes / Preparation Instructions'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keep original invoice ready / verify cause list..."
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
            >
              {isHi ? 'कैलेंडर में जोड़ें' : 'Save Docket Entry'}
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {matterTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>{isHi ? 'इस केस में कोई लंबित कार्य नहीं है' : 'No tasks or deadlines scheduled for this matter'}</p>
          </div>
        ) : (
          matterTasks.map(task => {
            const isCompleted = task.status === 'Completed';
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  isCompleted ? 'bg-slate-50/70 opacity-70' : 'hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                      isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-amber-600 bg-white'
                    }`}
                    title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                        {task.type}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        task.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center space-x-1 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} {task.time ? `at ${task.time}` : ''}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.assignedTo}</span>
                      </span>
                    </div>

                    {task.notes && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{task.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleSendReminderAlert(task)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                    title="Send WhatsApp & SMS reminder notification"
                  >
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isHi ? 'व्हाट्सएप स्मरण' : 'Trigger Alert'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
