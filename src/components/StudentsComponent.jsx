import { useState, useEffect } from "react";
import { db } from "../firebase"; // Import your Firebase configuration
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const StudentsComponent = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch students data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();
    if (name && roll && email) {
      try {
        setLoading(true);
        await addDoc(collection(db, "students"), {
          name,
          roll,
          email,
        });

        // Reset form fields
        setName("");
        setRoll("");
        setEmail("");

        // Fetch updated student list
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
      } catch (err) {
        setError("Failed to add student");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter((student) => student.id !== id));
      setStudentToDelete(null);
      setError(null);
    } catch (err) {
      setError("Failed to delete student");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl bg-gray-900 min-h-screen">
      <Card className="bg-black border-yellow-500 border-2 text-white shadow-lg shadow-yellow-500/20">
        <CardHeader className="border-b border-yellow-500/30">
          <CardTitle className="text-2xl font-bold text-yellow-400">Student Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Add Student Form */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-yellow-300">Add New Student</h3>
            <form onSubmit={addStudent} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-800 border-yellow-500/50 focus:border-yellow-400 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Roll Number"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  required
                  className="bg-gray-800 border-yellow-500/50 focus:border-yellow-400 text-white placeholder:text-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-yellow-500/50 focus:border-yellow-400 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  {loading ? "Processing..." : "Add Student"}
                </Button>
              </div>
            </form>
          </div>

          {/* Display Error if any */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-500 text-white">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Students List */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-yellow-300">Students List</h3>
            {loading && <p className="text-gray-400">Loading students data...</p>}

            {!loading && students.length === 0 ? (
              <div className="bg-gray-800 rounded-md p-6 text-center border border-yellow-500/20">
                <p className="text-gray-400">No students data available</p>
              </div>
            ) : (
              <div className="rounded-md border border-yellow-500/30 overflow-hidden">
                <Table>
                  <TableHeader className="bg-yellow-500/10">
                    <TableRow className="border-b border-yellow-500/30">
                      <TableHead className="text-yellow-300">Name</TableHead>
                      <TableHead className="text-yellow-300">Roll No.</TableHead>
                      <TableHead className="text-yellow-300">Email</TableHead>
                      <TableHead className="text-yellow-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow
                        key={student.id}
                        className={`
                          border-b border-yellow-500/20 hover:bg-yellow-500/5
                          ${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-black'}
                        `}
                      >
                        <TableCell className="font-medium text-white">{student.name}</TableCell>
                        <TableCell className="text-gray-300">{student.roll}</TableCell>
                        <TableCell className="text-gray-300">{student.email}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                                onClick={() => setStudentToDelete(student.id)}
                              >
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 text-white border-yellow-500/30">
                              <DialogHeader>
                                <DialogTitle className="text-yellow-400">Confirm Deletion</DialogTitle>
                                <DialogDescription className="text-gray-300">
                                  Are you sure you want to delete this student? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  onClick={() => setStudentToDelete(null)}
                                  className="bg-gray-700 hover:bg-gray-800 text-white font-semibold"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => deleteStudent(studentToDelete)}
                                  className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsComponent;
