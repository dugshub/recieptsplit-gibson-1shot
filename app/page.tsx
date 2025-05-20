import Link from 'next/link'

export default async function Home() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-primary">SplitReceipt</h1>
        <p className="text-xl text-muted-foreground">
          The easiest way to split expenses and track who owes what
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/auth/login" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium"
          >
            Login
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-md font-medium"
          >
            Register
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border rounded-lg p-6 text-left">
            <h3 className="text-xl font-semibold mb-2">Create Trips</h3>
            <p className="text-muted-foreground">Organize your expenses by trips or events with friends, family, or colleagues.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-left">
            <h3 className="text-xl font-semibold mb-2">Upload Receipts</h3>
            <p className="text-muted-foreground">Easily record and categorize your expenses with detailed receipt tracking.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-left">
            <h3 className="text-xl font-semibold mb-2">Split Fairly</h3>
            <p className="text-muted-foreground">Split costs evenly or by custom amounts and see who owes what at a glance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}